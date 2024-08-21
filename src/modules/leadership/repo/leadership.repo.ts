import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { tableName } from 'src/common/var/table-name.var';
import { LimitWithTopListDto } from '../dto/create-leadership.dto';
import { LeadershipEnum } from '../enum/leadership.enum';

@Injectable()
export class LeadershipRepo {
  private leadership_table = tableName.leadership;
  private table = tableName.studentProfiles;
  private transaction_table = tableName.transactions;
  private level_table = tableName.levels;
  private level_on_profiles_table = tableName.levelsM2MProfiles;

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async saveLeadership(knex = this.knex) {
    const subQuery = knex(`${this.table} as p`)
      .leftJoin('students as s', function () {
        this.on('s.id', '=', 'p.student_id').andOn(
          's.is_deleted',
          '=',
          knex.raw('false'),
        );
      })
      .select('p.*', 's.school_id')
      .select(
        knex.raw(
          'ROW_NUMBER() OVER (PARTITION BY s.school_id ORDER BY p.gem DESC) AS last_position_by_gem',
        ),
      )
      .whereNull('p.deleted_at')
      .as('sub');

    const rankedQuery = await knex(subQuery)
      .leftJoin(`${this.transaction_table} as t`, function () {
        this.on('t.profile_id', '=', 'sub.id')
          .andOnNull('t.deleted_at')
          .andOn(knex.raw('t.total_gem >= 0'));
      })
      .select(
        knex.raw([
          'sub.id as profile_id',
          'sub.school_id',
          'sub.last_position_by_gem::integer',
        ]),
      )
      .select(
        knex.raw(
          'ROW_NUMBER() OVER (PARTITION BY sub.school_id ORDER BY SUM(coalesce(t.total_gem, 0)) DESC, sub.gem desc)::integer AS last_position_by_earning',
        ),
      )
      .groupBy('sub.id', 'sub.gem', 'sub.school_id', 'sub.last_position_by_gem')
      .as('ranked');

    await knex(this.leadership_table)
      .insert(rankedQuery)
      .onConflict('profile_id')
      .merge({
        last_position_by_gem: knex.raw(
          'EXCLUDED.last_position_by_gem::integer',
        ),
        last_position_by_earning: knex.raw(
          'EXCLUDED.last_position_by_earning::INTEGER',
        ),
      });

    return true;
  }

  async findTopListBySchool(
    dto: LimitWithTopListDto,
    profileId: string,
    knex = this.knex,
  ) {
    const withQuery = knex.with('rankedProfiles', (qb) => {
      qb.select(
        knex.raw([
          'p.*',
          'p.gem::double precision as gem',
          'lv.level as stage',
          's.first_name',
          's.last_name',
          knex.raw(
            'SUM(coalesce(t.total_gem, 0))::double precision AS total_earning',
          ),
          knex.raw(
            'ROW_NUMBER() OVER (PARTITION BY s.school_id ORDER BY p.gem DESC)::integer AS position_by_gem',
          ),
          knex.raw(
            'ROW_NUMBER() OVER (PARTITION BY s.school_id ORDER BY SUM(coalesce(t.total_gem, 0)) DESC, p.gem desc)::integer AS position_by_earning',
          ),
        ]),
      )
        .from(`${this.table} AS p`)
        .leftJoin('students AS s', function () {
          this.on('s.id', '=', 'p.student_id')
            .andOn(knex.raw('s.is_deleted is false'))
            .andOnNotNull('s.school_id');
        })
        .leftJoin(`${this.transaction_table} AS t`, function () {
          this.on('t.profile_id', '=', 'p.id')
            .andOnNull('t.deleted_at')
            .andOn(knex.raw('t.total_gem > 0'));
        })
        .leftJoin(`${this.level_on_profiles_table} as lp`, function () {
          this.on('lp.profile_id', '=', 'p.id');
        })
        .leftJoin(`${this.level_table} as lv`, function () {
          this.on('lv.id', '=', 'lp.level_id').andOnNull('lv.deleted_at');
        })
        .whereNull('p.deleted_at')
        .groupBy(
          'p.id',
          's.school_id',
          'p.gem',
          'lv.level',
          's.first_name',
          's.last_name',
        );
    });

    const data = withQuery
      .clone()
      .select(
        'rp.*',
        knex.raw(
          `(COALESCE(l.last_position_by_earning, rp.position_by_earning) - rp.position_by_earning) AS status_by_earning`,
        ),
        knex.raw(
          `(COALESCE(l.last_position_by_gem, rp.position_by_gem) - rp.position_by_gem) AS status_by_gem`,
        ),
      )
      .from('rankedProfiles AS rp')
      .leftJoin(`${this.leadership_table} AS l`, function () {
        this.on('l.profile_id', '=', 'rp.id').andOnNull('l.deleted_at');
      })
      .leftJoin('students AS s', function () {
        this.on('s.id', 'rp.student_id')
          .andOn(knex.raw('s.is_deleted is false'))
          .andOnNotNull('s.school_id');
      })
      .where(
        's.school_id',
        '=',
        knex
          .select('s.school_id')
          .from(`${this.table} AS p`)
          .leftJoin('students AS s', function () {
            this.on('s.id', 'p.student_id')
              .andOn(knex.raw('s.is_deleted is false'))
              .andOnNotNull('s.school_id');
          })
          .where('p.id', '=', profileId)
          .limit(1),
      )
      .limit(dto.limit);
    const me = await data
      .clone()
      .select('*')
      .from('rankedProfiles as rp')
      .where('rp.id', profileId)
      .first();
    dto.top_type == LeadershipEnum.BY_GEM
      ? data.orderBy('rp.position_by_gem')
      : data.orderBy('rp.position_by_earning');
    return { top: await data, me };
  }
}
