import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { TransactionEntity } from '../entity/transaction.entity';
import { ICreateSpending } from '../interface/create-spending-transaction.interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IFindAllTransaction } from '../interface/find-all-transaction.interface';
import { tableName } from 'src/common/var/table-name.var';
import { CreateEarningDto } from '../dto/create-earning-transaction.dto';

export class TransactionRepo {
  private readonly table = tableName.transactions;
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async createEarning(
    dto: CreateEarningDto[],
    knex = this.knex,
  ): Promise<TransactionEntity[]> {
    const data = await knex.batchInsert(this.table, dto).returning('*');
    return data as TransactionEntity[];
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

  async sumAllEarning(profileId: string, knex = this.knex): Promise<number> {
    const { totalearned } = await knex
      .select(knex.raw(['sum(total_gem)::double precision as totalEarned']))
      .from(this.table)
      .where('profile_id', profileId)
      .andWhere('deleted_at', null)
      .andWhereNot('channel_id', null)
      .first();
    return totalearned;
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
