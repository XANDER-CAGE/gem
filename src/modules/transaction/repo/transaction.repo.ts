import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { TransactionEntity } from '../entity/transaction.entity';
import { ICreateSpending } from '../interface/create-spending-transaction.interface';
import {
  PaginationDto,
  TransactionListDto,
} from 'src/common/dto/pagination.dto';
import { IFindAllTransaction } from '../interface/find-all-transaction.interface';
import { tableName } from 'src/common/var/table-name.var';
import { CreateEarningDto } from '../dto/create-earning-transaction.dto';
import { CreateManualTransactionDto } from '../dto/create.transaction.dto';

export class TransactionRepo {
  private readonly transactionTable = tableName.transactions;
  private readonly channelsTable = tableName.channels;
  private readonly streaksTable = tableName.streaks;
  private readonly fullStreaksTable = tableName.fullStreaks;
  private readonly levelsTable = tableName.levels;
  private readonly badgesTable = tableName.badges;
  private readonly productTable = tableName.marketProducts;
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async createManual(
    dto: CreateManualTransactionDto,
    userId: string,
    knex = this.knex,
  ) {
    return knex
      .insert({
        total_gem: dto.amount,
        user_id: userId,
        profile_id: dto.profile_id,
      })
      .into(this.transactionTable)
      .returning(knex.raw(['*', 'total_gem::double precision']));
  }

  async createEarning(
    dto: CreateEarningDto,
    knex = this.knex,
  ): Promise<TransactionEntity> {
    const [transaction] = await knex
      .insert(dto)
      .into(this.transactionTable)
      .returning('*');
    return transaction;
  }

  async createSpending(
    dto: ICreateSpending,
    knex = this.knex,
  ): Promise<TransactionEntity> {
    const [data] = await knex
      .insert({
        ...dto,
      })
      .into(this.transactionTable)
      .returning('*');
    return data;
  }

  async findAll(
    dto: PaginationDto,
    knex = this.knex,
  ): Promise<IFindAllTransaction> {
    const { limit = 10, page = 1 } = dto;
    const innerQuery = knex(this.transactionTable)
      .select('*')
      .where('deleted_at', null)
      .limit(limit)
      .offset((page - 1) * limit)
      .as('c');
    const [{ total, data }] = await knex
      .select([
        knex.raw(
          '(SELECT COUNT(id) FROM ?? WHERE deleted_at is null) AS total',
          this.transactionTable,
        ),
        knex.raw('jsonb_agg(c.*) AS data'),
      ])
      .from(innerQuery);

    return { total: +total, data };
  }

  async findOne(id: string, knex = this.knex): Promise<TransactionEntity> {
    return await knex
      .select('*')
      .from(this.transactionTable)
      .where('id', id)
      .andWhere('deleted_at', null)
      .first();
  }

  async sumAllEarning(profileId: string, knex = this.knex): Promise<number> {
    const { totalEarned } = await knex
      .select(knex.raw(['sum(total_gem)::double precision as totalEarned']))
      .from(this.transactionTable)
      .where('profile_id', profileId)
      .andWhere('deleted_at', null)
      .andWhereNot('channel_id', null)
      .first();
    return totalEarned || 0;
  }

  async transactionHistory(
    dto: TransactionListDto,
    profileId: string,
    knex = this.knex,
  ) {
    const { limit = 10, page = 1, start_date, end_date, listType } = dto;

    const baseQuery = knex(`${this.transactionTable} as t`)
      .leftJoin(`${this.channelsTable} as ch`, 't.channel_id', 'ch.id')
      .leftJoin(`${this.streaksTable} as st`, 't.streak_id', 'st.id')
      .leftJoin(`${this.levelsTable} as l`, 't.level_id', 'l.id')
      .leftJoin(`${this.fullStreaksTable} as fs`, 't.full_streak_id', 'fs.id')
      .leftJoin(`${this.badgesTable} as b`, 't.badge_id', 'b.id')
      .leftJoin(`${this.productTable} as mp`, 't.product_id', 'mp.id')
      .whereNull('t.deleted_at')
      .andWhere('t.profile_id', profileId)
      .andWhere('t.created_at', '>', start_date || '1970-01-01')
      .andWhere('t.created_at', '<', end_date || '3000-01-01')
      .andWhere(function () {
        if (listType) {
          this.where('t.total_gem', listType === 'expense' ? '<' : '>', 0);
        }
      });

    const [{ total }] = await baseQuery.clone().count('* as total');
    const data = await baseQuery
      .select(
        knex.raw([
          `case 
            when t.user_id is not null
              then 'Manual'
              else coalesce(ch.name, st.name, l.name, fs.name, b.name, mp.name)
            end as title`,
          't.id',
          't.total_gem::double precision as total_gem',
          't.created_at',
        ]),
      )
      .limit(limit)
      .offset((page - 1) * limit);

    return { total: +total, data: data };
  }
}
