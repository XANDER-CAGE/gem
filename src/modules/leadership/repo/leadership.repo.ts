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

    const rankedQuery = knex(subQuery)
      .leftJoin(`${this.transaction_table} as t`, function () {
        this.on('t.profile_id', '=', 'sub.id')
          .andOnNull('t.deleted_at')
          .andOn('t.total_gem', '>=', knex.raw('?', [0]));
      })
      .select(
        'sub.id as profile_id',
        'sub.gem',
        'sub.school_id',
        'sub.last_position_by_gem',
      )
      .select(
        knex.raw(
          'ROW_NUMBER() OVER (PARTITION BY sub.school_id ORDER BY sum(t.total_gem) DESC, sub.gem DESC) AS last_position_by_earning',
        ),
      )
      .groupBy('sub.id', 'sub.gem', 'sub.school_id', 'sub.last_position_by_gem')
      .as('ranked');

    knex(this.leadership_table)
      .insert(function () {
        this.select(
          'ranked.profile_id',
          'ranked.last_position_by_gem',
          'ranked.last_position_by_earning',
          'ranked.school_id',
        )
          .from(rankedQuery)
          .where('ranked.last_position_by_earning', '<=', 50);
      })
      .onConflict('profile_id')
      .merge({
        last_position_by_gem: knex.raw('EXCLUDED.last_position_by_gem'),
        last_position_by_earning: knex.raw('EXCLUDED.last_position_by_earning'),
      });
  }
}
