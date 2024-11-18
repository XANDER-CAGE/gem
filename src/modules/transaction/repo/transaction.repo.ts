import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { TransactionEntity } from '../entity/transaction.entity';
import { ICreateSpending } from '../interface/create-spending-transaction.interface';
import {
  TransactionFinishedList,
  TransactionListDto,
} from 'src/common/dto/pagination.dto';
import { IFindAllTransaction } from '../interface/find-all-transaction.interface';
import { tableName } from 'src/common/var/table-name.var';
import { CreateEarningDto } from '../dto/create-earning-transaction.dto';
import { TransactionUpdateStatus } from '../dto/create.transaction.dto';

export class TransactionRepo {
  private readonly transactionTable = tableName.transactions;
  private readonly streaksTable = tableName.streaks;
  private readonly levelsTable = tableName.levels;
  private readonly badgesTable = tableName.badges;
  private readonly productTable = tableName.marketProducts;
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async createManual(
    dto: { profile_id: string; amount: number },
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
    dto: TransactionFinishedList,
    knex = this.knex,
  ): Promise<IFindAllTransaction> {
    const { limit = 10, page = 1, start_date, end_date, name, uid } = dto;

    const innerQuery = knex('gamification.transactions as t')
      .select([
        't.id',
        's.uid',
        knex.raw("concat(s.first_name, ' ', s.last_name) as full_name"),
        'mp.name',
        't.total_gem',
        't.status',
        't.created_at',
      ])
      .leftJoin('gamification.student_profiles as st', 't.profile_id', 'st.id')
      .leftJoin('students as s', 's.id', 'st.student_id')
      .leftJoin('gamification.market_products as mp', 't.product_id', 'mp.id')
      .where('t.total_gem', '<', 0)
      .whereNull('t.deleted_at');

    if (start_date && end_date) {
      innerQuery.whereBetween('t.created_at', [start_date, end_date]);
    } else if (start_date) {
      innerQuery.where('t.created_at', '>=', start_date);
    } else if (end_date) {
      innerQuery.where('t.created_at', '<=', end_date);
    }

    if (name) {
      innerQuery.where(
        knex.raw('LOWER(mp.name)'),
        'like',
        `%${name.toLowerCase()}%`,
      );
    }

    if (uid) {
      innerQuery.where('t.uid', uid);
    }

    const [{ total }] = await knex(innerQuery.clone().as('count_query')).count(
      'id as total',
    );

    const data: any = await innerQuery
      .limit(limit)
      .offset((page - 1) * limit)
      .then((rows) => rows);

    return {
      total: +total,
      data,
    };
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
    const { count } = await knex
      .select(knex.raw(['sum(total_gem)::double precision as count']))
      .from(this.transactionTable)
      .where('profile_id', profileId)
      .andWhere('deleted_at', null)
      .andWhere('total_gem', '>', 0)
      .first();
    return count || 0;
  }

  async transactionHistory(
    dto: TransactionListDto,
    profileId: string,
    knex = this.knex,
  ) {
    const { limit = 10, page = 1, start_date, end_date, listType } = dto;

    const baseQuery = knex(`${this.transactionTable} as t`)
      .leftJoin(`${this.streaksTable} as st`, 't.streak_id', 'st.id')
      .leftJoin(`${this.levelsTable} as l`, 't.level_id', 'l.id')
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
              then 'Moderator'
              else coalesce(st.name, l.name, b.name, mp.name)
            end as title`,
          `case 
            when t.user_id is not null
              then true
              else false
            end as is_moderator`,
          't.id',
          't.total_gem::double precision as total_gem',
          't.created_at',
        ]),
      )
      .limit(limit)
      .offset((page - 1) * limit);

    return { total: +total, data: data };
  }

  async updateStatus({ id, status }: TransactionUpdateStatus) {}
}
