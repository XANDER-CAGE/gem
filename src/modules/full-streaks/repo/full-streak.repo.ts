import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { IFindAllFullStreak } from '../interface/full-streak.interface';
import { CreateFullStreakDto } from '../dto/create-full-streaks.dto';
import { UpdateFullStreakDto } from '../dto/update-full-streaks.dto';
import { FullStreakEntity } from '../entity/full-streak.entity';
import { tableName } from 'src/common/var/table-name.var';
import { FullStreaksOnProfiles } from '../entity/full-streaks-on-profiles.entity';
import { FindAllFullStreaksDto } from '../dto/find-all.full-streak';

@Injectable()
export class FullStreakRepo {
  private table = tableName.fullStreaks;
  private relationTable = tableName.fullStreaksM2Mprofiles;
  constructor(@InjectConnection() private readonly knex: Knex) {}
  async findAll(
    dto: FindAllFullStreaksDto,
    knex = this.knex,
  ): Promise<IFindAllFullStreak> {
    const { limit = 10, page = 1, channel_id: channelId } = dto;
    const innerQuery = knex(this.table)
      .select('*')
      .where('deleted_at', null)
      .andWhere(function () {
        if (channelId) {
          this.where('channel_id', channelId);
        }
      })
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
    const maxResult = await knex(this.table).max('level as max_level');
    const maxLevel = maxResult[0].max_level;

    const [res] = await knex(this.table)
      .insert({ ...data, level: maxLevel + 1 })
      .returning('*');
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
