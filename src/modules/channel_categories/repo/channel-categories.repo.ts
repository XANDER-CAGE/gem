import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateChannelCategoriesDto } from '../dto/channel-categories-create.dto';
import { ChannelCategoriesEntity } from '../entity/channel-categories.entity';
import { UpdateChannelCategoriesDto } from '../dto/channel-categories-update.dto';
import { IFindAllChannelCategories } from '../interface/channel-categories.interface';

export class ChannelCategoriesRepo {
  private readonly table = 'channel_categories';
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(
    dto: CreateChannelCategoriesDto,
    knex = this.knex,
  ): Promise<ChannelCategoriesEntity> {
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
  ): Promise<IFindAllChannelCategories> {
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

  async findOne(
    id: string,
    knex = this.knex,
  ): Promise<ChannelCategoriesEntity> {
    return await knex
      .select('*')
      .from(this.table)
      .where('id', id)
      .andWhere('deleted_at', null)
      .first();
  }

  async update(
    id: string,
    dto: UpdateChannelCategoriesDto,
    knex = this.knex,
  ): Promise<ChannelCategoriesEntity> {
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
