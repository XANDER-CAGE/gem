import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { TransactionEntity } from '../entity/transaction.entity';
import { ICreateEarn } from '../interface/create-earn-transaction.interface';
import { ICreateSpending } from '../interface/create-spending-transaction.interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IFindAllTransaction } from '../interface/find-all-transaction.interface';

export class TransactionRepo {
  private readonly table = 'transactions';
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async createEarning(
    dto: ICreateEarn,
    knex = this.knex,
  ): Promise<TransactionEntity> {
    const [data] = await knex
      .insert({
        ...dto,
      })
      .into(this.table)
      .returning('*');
    return data;
  }

  async createSpending(
    dto: ICreateSpending,
    knex = this.knex,
  ): Promise<TransactionEntity> {
    const [data] = await knex
      .insert({
        ...dto,
      })
      .into(this.table)
      .returning('*');
    return data;
  }

  async findAll(
    dto: PaginationDto,
    knex = this.knex,
  ): Promise<IFindAllTransaction> {
    const { limit = 10, page = 1 } = dto;
    const innerQuery = knex(this.table)
      .select('*')
      .where('deleted_at', null)
      .limit(limit)
      .offset((page - 1) * limit)
      .as('c');
    const [{ total, data }] = await knex
      .select([
        knex.raw(
          '(SELECT COUNT(id) FROM ?? WHERE deleted_at is null) AS total',
          this.table,
        ),
        knex.raw('jsonb_agg(c.*) AS data'),
      ])
      .from(innerQuery);

    return { total: +total, data };
  }

  async findOne(id: string, knex = this.knex): Promise<TransactionEntity> {
    return await knex
      .select('*')
      .from(this.table)
      .where('id', id)
      .andWhere('deleted_at', null)
      .first();
  }

  async sumAllEarning(profileId: string, knex = this.knex) {
    return knex('transactions')
      .select(knex.raw('SUM(total_gem) as totalEarned'))
      .where('profile_id', profileId)
      .andWhere('deleted_at', null)
      .andWhereNot('channel_id', null);
  }
  async sumTopEarning(limit: number, knex = this.knex) {
    const data = knex
      .with('RankedProfiles', (qb) => {
        qb.select(
          'p.*',
          knex.raw('SUM(t.total_gem) AS total'),
          knex.raw(
            'ROW_NUMBER() OVER (ORDER BY SUM(t.total_gem) DESC, p.gem DESC) AS last_position_by_earning',
          ),
        )
          .from('student_profiles AS p')
          .leftJoin('transactions AS t', function () {
            this.on('t.profile_id', '=', 'p.id')
              .andOnNull('t.deleted_at')
              .andOnNotNull('t.channel_id');
          })
          .whereNull('p.deleted_at')
          .groupBy('p.id', 'p.gem');
      })
      .select(
        'rp.*',
        knex.raw(
          '(COALESCE(l.last_position_by_earning, rp.last_position_by_earning) - rp.last_position_by_earning) AS status',
        ),
      )
      .from('RankedProfiles AS rp')
      .leftJoin('leadership AS l', function () {
        this.on('l.profile_id', '=', 'rp.id').andOnNull('l.deleted_at');
      })
      .orderBy('rp.last_position_by_earning')
      .limit(limit);

    return data;
  }

  // async update(
  //   id: string,
  //   dto: UpdateEarningDto | UpdateSpendingDto,
  //   knex = this.knex,
  // ) {
  //   const [data] = await knex(this.table)
  //     .update({
  //       ...dto,
  //       updated_at: new Date(),
  //     })
  //     .where('id', id)
  //     .andWhere('deleted_at', null)
  //     .returning('*');
  //   return data;
  // }

  // async delete(id: string, knex = this.knex): Promise<void> {
  //   await knex(this.table)
  //     .update({
  //       deleted_at: new Date(),
  //       updated_at: new Date(),
  //     })
  //     .where('id', id)
  //     .andWhere('deleted_at', null);
  // }
}
