import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IFindAllStreaks } from '../interface/streaks.interface';
import { CreateStreakDto } from '../dto/create-streaks.dto';
import { StreakEntity } from '../entity/streaks.entity';
import { UpdateStreakDto } from '../dto/update-streaks.dto';
import { tableName } from 'src/common/var/table-name.var';

@Injectable()
export class StreaksRepo {
  private table = tableName.streaks;

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

  async channelExists(id: string, knex = this.knex) {
    return await knex
      .select('*')
      .from('channels')
      .where('id', id)
      .andWhere('deleted_at', null)
      .first();
  }

  async findOneByChannelId(channelId: string, level: number, knex = this.knex) {
    const data = await knex
      .select(
        knex.raw([
          '*',
          'streak_reward::double precision as streak_reward',
          `((select count(*) from ${this.table} where channel_id = '${channelId}' and deleted_at is null) = level) as is_last`,
        ]),
      )
      .from(`${this.table}`)
      .where('channel_id', channelId)
      .andWhere('deleted_at', null)
      .andWhere('level', level)
      .first();
    return data || null;
  }

  async create(data: CreateStreakDto, knex = this.knex): Promise<StreakEntity> {
    const [res] = await knex(this.table).insert(data).returning('*');
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

  async deleteOne(id: string, knex = this.knex) {
    await knex(this.table)
      .update({
        deleted_at: new Date(),
        updated_at: new Date(),
      })
      .where('id', id)
      .andWhere('deleted_at', null);
  }
}
