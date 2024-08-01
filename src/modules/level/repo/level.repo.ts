import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IFindAllLevel } from '../interface/level.interface';
import { CreateLevelDto } from '../dto/create-level.dto';
import { UpdateLevelDto } from '../dto/update-level.dto';
import { LevelEntity } from '../entity/level.entity';

@Injectable()
export class LevelRepo {
  private table = 'levels';

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findAll(dto: PaginationDto, knex = this.knex): Promise<IFindAllLevel> {
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

  async create(data: CreateLevelDto, knex = this.knex): Promise<LevelEntity> {
    const maxResult = await knex(this.table).max('level as max_level');
    const maxLevel = maxResult[0].max_level;

    const [res] = await knex(this.table)
      .insert({ ...data, level: maxLevel + 1 })
      .returning('*');
    return res;
  }

  async update(id: string, data: UpdateLevelDto, knex = this.knex) {
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

  async deleteOne( knex = this.knex) {
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
