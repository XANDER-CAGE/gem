import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { IFindAllStreaks } from '../interface/streaks.interface';
import { CreateStreakDto } from '../dto/create-streaks.dto';
import { StreakEntity } from '../entity/streaks.entity';
import { UpdateStreakDto } from '../dto/update-streaks.dto';
import { tableName } from 'src/common/var/table-name.var';
import { FindAllStreaksDto } from '../dto/find-all.streaks.dto';

@Injectable()
export class StreaksRepo {
  private table = tableName.streaks;

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findAll(
    dto: FindAllStreaksDto,
    knex = this.knex,
  ): Promise<IFindAllStreaks> {
    const { limit = 10, page = 1 } = dto;
    const innerQuery = knex(this.table)
      .select('*')
      .where('deleted_at', null)
      .andWhere(function () {
        if (dto.channel_id) {
          this.where('channel_id', dto.channel_id);
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

  async findOne(id: string, knex = this.knex) {
    return await knex
      .select('*')
      .from(this.table)
      .where('id', id)
      .andWhere('deleted_at', null)
      .first();
  }

  async channelExists(id: string, knex = this.knex) {
    return await knex
      .select('*')
      .from('channels')
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
}
