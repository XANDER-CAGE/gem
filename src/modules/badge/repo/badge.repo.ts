import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { CreateBadgeDto, UpdateBadgeDto } from '../dto/badge.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IBadge, IFindAllBadge } from '../entity/badge.entity';

export class BadgeRepo {
  private readonly table = 'badges';
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(dto: CreateBadgeDto, knex = this.knex): Promise<IBadge> {
    const [data] = await knex
      .insert({
        ...dto,
      })
      .into(this.table)
      .returning('*');
    return data;
  }

  async findAll(dto: PaginationDto, knex = this.knex): Promise<IFindAllBadge> {
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

  async findOne(id: string, knex = this.knex): Promise<IBadge> {
    return await knex
      .select('*')
      .from(this.table)
      .where('id', id)
      .andWhere('deleted_at', null)
      .first();
  }

  async update(
    id: string,
    dto: UpdateBadgeDto,
    knex = this.knex,
  ): Promise<IBadge> {
    const [data] = await knex(this.table)
      .update({
        ...dto,
        updated_at: new Date(),
      })
      .where('id', id)
      .andWhere('deleted_at', null)
      .returning('*');
    return data;
  }

  async delete(id: string, knex = this.knex): Promise<void> {
    await knex(this.table)
      .update({
        deleted_at: new Date(),
        updated_at: new Date(),
      })
      .where('id', id)
      .andWhere('deleted_at', null);
  }
}
