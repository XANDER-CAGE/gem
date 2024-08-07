import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class LeadershipRepo {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async saveLeadership(knex = this.knex) {
    const subQuery = knex('student_profiles as p')
      .leftJoin('transactions as t', function () {
        this.on('t.profile_id', '=', 'p.id')
          .andOnNull('t.deleted_at')
          .andOnNotNull('t.channel_id');
      })
      .whereNull('p.deleted_at')
      .select(
        'p.id',
        'p.gem',
        knex.raw('SUM(t.total_gem) AS total'),
        knex.raw(
          'ROW_NUMBER() OVER (ORDER BY p.gem DESC) AS last_position_by_gem',
        ),
      )
      .groupBy('p.id', 'p.gem')
      .as('sub');

    const mainQuery = knex('leadership')
      .insert(function () {
        this.select(
          knex.raw('generate_object_id() AS id'),
          'sub.id AS profile_id',
          'sub.last_position_by_gem',
          knex.raw(
            'ROW_NUMBER() OVER (ORDER BY sub.total DESC, sub.gem DESC) AS last_position_by_earning',
          ),
        )
          .from(subQuery)
          .orderByRaw('sub.total DESC, sub.gem DESC')
          .limit(10);
      })
      .onConflict('profile_id')
      .merge({
        last_position_by_gem: knex.raw('EXCLUDED.last_position_by_gem'),
        last_position_by_earning: knex.raw('EXCLUDED.last_position_by_earning'),
      })
      .returning([
        'profile_id',
        'last_position_by_gem',
        'last_position_by_earning',
      ]);

    return await mainQuery;
  }
}
