import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IFindAllFullStreak } from '../interface/full-streak.interface';
import { CreateFullStreakDto } from '../dto/create-full-streaks.dto';
import { UpdateFullStreakDto } from '../dto/update-full-streaks.dto';
import { FullStreakEntity } from '../entity/full-streak.entity';
import { tableName } from 'src/common/var/table-name.var';
import { FullStreaksOnProfiles } from '../entity/full-streaks-on-profiles.entity';

@Injectable()
export class FullStreakRepo {
  private table = tableName.fullStreaks;
  private relationTable = tableName.fullStreaksM2Mprofiles;
  constructor(@InjectConnection() private readonly knex: Knex) {}
  async findAll(
    dto: PaginationDto,
    knex = this.knex,
  ): Promise<IFindAllFullStreak> {
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

  async findOne(id: string, knex = this.knex): Promise<FullStreakEntity> {
    return await knex
      .select('*')
      .from(this.table)
      .where('id', id)
      .andWhere('deleted_at', null)
      .first();
  }

  async create(
    data: CreateFullStreakDto,
    knex = this.knex,
  ): Promise<FullStreakEntity> {
    const [res] = await knex(this.table).insert(data).returning('*');
    return res;
  }

  async update(id: string, data: UpdateFullStreakDto, knex = this.knex) {
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

  async deleteOne(id: string, knex = this.knex) {
    await knex(this.table)
      .update({
        deleted_at: new Date(),
        updated_at: new Date(),
      })
      .where('id', id)
      .andWhere('deleted_at', null);
  }

  async getLastFullStreak(
    profileId: string,
    channelId: string,
    knex = this.knex,
  ): Promise<FullStreaksOnProfiles> {
    const fullStreak = await knex
      .select(
        knex.raw([
          'fs.*',
          'fsp.joined_at as joined_at',
          'fs.reward_gem::double precision as reward_gem',
          `((select count(*) from ${this.table} where deleted_at is null and channel_id = '${channelId}') = level) as is_last`,
        ]),
      )
      .leftJoin('full_streaks as fs', function () {
        this.on('fs.id', 'fsp.full_streak_id')
          .andOn(knex.raw(`fs.channel_id = '${channelId}'`))
          .andOn(knex.raw('fs.deleted_at is null'));
      })
      .from(`${this.relationTable} as fsp`)
      .where('fsp.profile_id', profileId)
      .andWhere(knex.raw('fs.deleted_at is null'))
      .orderBy('fsp.joined_at', 'desc')
      .first();
    return fullStreak || null;
  }

  async assignFullStreak(
    profileId: string,
    fullStreakId: string,
    knex = this.knex,
  ) {
    await knex
      .insert({ profile_id: profileId, full_streak_id: fullStreakId })
      .into(this.relationTable);
  }

  async getOneByLevel(
    channelId: string,
    level: number,
    knex = this.knex,
  ): Promise<FullStreakEntity> {
    return await knex
      .select('*', knex.raw('reward_gem::double precision as reward_gem'))
      .from(this.table)
      .where('channel_id', channelId)
      .andWhere('level', level)
      .andWhere('deleted_at', null)
      .first();
  }
}
