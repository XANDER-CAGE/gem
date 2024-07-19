import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IFindAllFullStreak } from '../interface/full-streak.interface';
import { CreateFullStreakDto } from '../dto/create-full-streaks.dto';
import { UpdateFullStreakDto } from '../dto/update-full-streaks.dto';

@Injectable()
export class FullStreakRepo {
  private table = 'full_streaks';
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

  async findOne(id: string, knex = this.knex) {
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
  ): Promise<CreateFullStreakDto> {
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
}
