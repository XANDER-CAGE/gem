import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { TransactionEntity } from '../entity/transaction.entity';
import { ICreateSpending } from '../interface/create-spending-transaction.interface';
import {
  PaginationDto,
  PaginationForTransactionHistory,
} from 'src/common/dto/pagination.dto';
import { IFindAllTransaction } from '../interface/find-all-transaction.interface';
import { tableName } from 'src/common/var/table-name.var';
import { CreateEarningDto } from '../dto/create-earning-transaction.dto';

export class TransactionRepo {
  private readonly table = tableName.transactions;
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async createEarning(
    dto: CreateEarningDto,
    knex = this.knex,
  ): Promise<TransactionEntity> {
    const [transaction] = await knex
      .insert(dto)
      .into(this.table)
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
    const { totalEarned } = await knex
      .select(knex.raw(['sum(total_gem)::double precision as totalEarned']))
      .from(this.table)
      .where('profile_id', profileId)
      .andWhere('deleted_at', null)
      .andWhereNot('channel_id', null)
      .first();
    return totalEarned || 0;
  }

  async listTopEarning(limit: number, knex = this.knex) {
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

  async listTopEarningBySchool(
    school_id: string,
    limit: number,
    knex = this.knex,
  ) {
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
        'sch.name',
        'rp.*',
        knex.raw(
          '(COALESCE(l.last_position_by_earning, rp.last_position_by_earning) - rp.last_position_by_earning) AS status',
        ),
      )
      .from('RankedProfiles AS rp')
      .leftJoin('leadership AS l', function () {
        this.on('l.profile_id', '=', 'rp.id').andOnNull('l.deleted_at');
      })
      .leftJoin('students AS s', 's.id', '=', 'rp.student_id')
      .leftJoin('school AS sch', 'sch.id', '=', 's.school_id')
      .where('sch.id', school_id)
      .orderBy('rp.last_position_by_earning')
      .limit(limit);

    return data;
  }

  async transactionHistory(
    dto: PaginationForTransactionHistory,
    knex = this.knex,
  ): Promise<IFindAllTransaction> {
    const { limit = 10, page = 1 } = dto;
    const innerQuery = knex
      .select(
        't.*',
        knex.raw('to_json(ch.*) as channel_obj'),
        knex.raw('to_json(st.*) as streak_obj'),
        knex.raw('to_json(l.*) as level_obj'),
        knex.raw('to_json(fs.*) as full_streak_obj'),
        knex.raw('to_json(b.*) as badge_obj'),
      )
      .from('transactions AS t')
      .leftJoin('channels AS ch', 't.channel_id', 'ch.id')
      .leftJoin('streaks AS st', 't.streak_id', 'st.id')
      .leftJoin('levels AS l', 't.level_id', 'l.id')
      .leftJoin('full_streaks AS fs', 't.full_streak_id', 'fs.id')
      .leftJoin('badges AS b', 't.badge_id', 'b.id')
      .leftJoin('market_products AS mp', 't.product_id', 'mp.id')
      .whereNotNull('t.deleted_at')
      .andWhere('t.profile_id', dto.profile_id);

    if (dto.start_date && dto.end_date) {
      innerQuery.andWhereBetween('t.created_at', [
        dto.start_date,
        dto.end_date,
      ]);
    } else if (dto.start_date) {
      innerQuery.andWhere('t.created_at', '>', dto.start_date);
    }
    innerQuery
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
