import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { IFindAllStreaks } from '../interface/streaks.interface';
import { CreateStreakDto } from '../dto/create-streaks.dto';
import { StreakEntity } from '../entity/streaks.entity';
import { UpdateStreakDto } from '../dto/update-streaks.dto';
import { tableName } from 'src/common/var/table-name.var';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class StreaksRepo {
  private table = tableName.streaks;
  private attendance_table = tableName.attendance;

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findAll(
    dto: PaginationDto,
    knex = this.knex,
  ): Promise<IFindAllStreaks> {
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

  async findOne(id: string, knex = this.knex) {
    return await knex
      .select('*')
      .from(this.table)
      .where('id', id)
      .andWhere('deleted_at', null)
      .first();
  }

  async findOneByLevel(level: number, knex = this.knex) {
    const data = await knex
      .select(
        knex.raw([
          '*',
          'streak_reward::double precision as streak_reward',
          `((select count(*) from ${this.table} where deleted_at is null) = level) as is_last`,
        ]),
      )
      .from(`${this.table}`)
      .whereNull('deleted_at')
      .andWhere('level', level)
      .first();
    return data || null;
  }

  async create(data: CreateStreakDto, knex = this.knex): Promise<StreakEntity> {
    const maxResult = await knex(this.table).max('level as max_level');
    const maxLevel = maxResult[0].max_level;

    const [res] = await knex(this.table)
      .insert({ ...data, level: maxLevel + 1 })
      .returning('*');
    return res;
  }

  async update(id: string, data: UpdateStreakDto, knex = this.knex) {
    const [updateMarket] = await knex(this.table)
      .update({
        ...data,
        updated_at: new Date(),
      })
      .where('id', id)
      .andWhere('deleted_at', null)
      .returning('*');
    return updateMarket;
  }

  async deleteOne(knex = this.knex) {
    const maxResult = await knex(this.table)
      .max('level as max_level')
      .where('deleted_at', null);
    const maxLevel = maxResult[0].max_level;
    await knex(this.table)
      .update({
        deleted_at: new Date(),
        updated_at: new Date(),
      })
      .where('level', maxLevel)
      .andWhere('deleted_at', null);
  }

  async findStreakStartDate(profileId: string, knex = this.knex) {
    const data = await knex
      .select('created_at')
      .from(this.attendance_table)
      .whereNull('deleted_at')
      .andWhere('profile_id', profileId)
      .andWhere(function () {
        this.where('success', false).orWhere('is_last_streak', true);
      })
      .orderBy('created_at', 'desc')
      .first();
    return data ? data.created_at : new Date('1970');
  }

  async countSuccess(profileId: string, startDate: Date, knex = this.knex) {
    const data = await knex
      .count('id')
      .from(this.attendance_table)
      .whereNull('deleted_at')
      .andWhere('profile_id', profileId)
      .andWhere(
        'created_at',
        '>',
        startDate.toISOString().replace('T', ' ').replace('Z', ''),
      )
      .andWhere('success', true)
      .first();
    return data.count || 0;
  }
}
