import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { tableName } from 'src/common/var/table-name.var';

@Injectable()
export class LeadershipRepo {
  private leadership_table = tableName.leadership;
  private table = tableName.studentProfiles;
  private transaction_table = tableName.transactions;

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
          'ROW_NUMBER() OVER (PARTITION BY sub.school_id ORDER BY sum(t.total_gem) DESC, sub.gem DESC)::integer AS last_position_by_earning',
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
    limit: number,
    profileId: string,
    knex = this.knex,
  ) {
    const withQuery = knex.with('rankedProfiles', (qb) => {
      qb.select(
        'p.*',
        's.school_id',
        knex.raw('SUM(t.total_gem) AS total_earning'),
        knex.raw(
          'ROW_NUMBER() OVER (PARTITION BY s.school_id ORDER BY p.gem DESC) AS position_by_gem',
        ),
        knex.raw(
          'ROW_NUMBER() OVER (PARTITION BY s.school_id ORDER BY SUM(t.total_gem) DESC, p.gem DESC) AS position_by_earning',
        ),
      )
        .from(`${this.table} AS p`)
        .leftJoin('students AS s', function () {
          this.on('s.id', '=', 'p.student_id').andOn(
            knex.raw('s.is_deleted is false'),
          );
        })
        .leftJoin(`${this.transaction_table} AS t`, function () {
          this.on('t.profile_id', '=', 'p.id')
            .andOnNull('t.deleted_at')
            .andOn(knex.raw('t.total_gem > 0'));
        })
        .whereNull('p.deleted_at')
        .groupBy('p.id', 's.school_id', 'p.gem');
    });
    const me = await withQuery
      .clone()
      .select('*')
      .from('rankedProfiles as rp')
      .where('rp.id', profileId)
      .first();

    const data = await withQuery
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
      .leftJoin('students AS s', 's.id', '=', 'rp.student_id')
      .where(
        's.school_id',
        '=',
        knex
          .select('s.school_id')
          .from(`${this.table} AS p`)
          .leftJoin('students AS s', 's.id', '=', 'p.student_id')
          .where('p.id', '=', profileId)
          .limit(1),
      )
      .orderBy('rp.position_by_earning')
      .orderBy('rp.position_by_gem')
      .limit(limit);
    return { data, me };
  }
}
