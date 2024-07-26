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
  async sumTopEarning(
    dto: PaginationDto,
    knex = this.knex,
  ): Promise<IFindAllTransaction> {
    const { limit = 50, page = 1 } = dto;

    const innerQuery = knex(this.table)
      .select('profile_id')
      .select(knex.raw('SUM(total_gem) as totalEarned'))
      .select(
        knex.raw(
          'ROW_NUMBER() OVER (ORDER BY SUM(total_gem) DESC) AS position',
        ),
      )
      .where('deleted_at', null)
      .andWhereNot('channel_id', null)
      .groupBy('profile_id')
      .orderBy('totalEarned', 'desc')
      .limit(limit)
      .offset((page - 1) * limit)
      .as('c');

    const [{ total, data }] = await knex
      .select([
        knex.raw(
          '(SELECT COUNT(DISTINCT profile_id) FROM ?? WHERE deleted_at is null AND channel_id is not null) AS total',
          'transactions',
        ),
        knex.raw('jsonb_agg(c.*) AS data'),
      ])
      .from(innerQuery);

    return { total: +total, data };
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
