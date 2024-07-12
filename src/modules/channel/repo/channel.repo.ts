import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import {
  CreateChannelDto,
  FindAllChannelDto,
  UpdateChannelDto,
} from '../dto/channel.dto';
import { IChannelInterface, IFindAll } from '../interface/channel.interface';

export class ChannelRepo {
  private readonly table = 'channels';
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(
    dto: CreateChannelDto,
    knex = this.knex,
  ): Promise<IChannelInterface> {
    const [channel] = await knex
      .insert({
        ...dto,
      })
      .into(this.table)
      .returning('*');
    return channel;
  }

  async findAll(dto: FindAllChannelDto, knex = this.knex): Promise<IFindAll> {
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

  async findOne(id: string, knex = this.knex): Promise<IChannelInterface> {
    return await knex
      .select('*')
      .from(this.table)
      .where('id', id)
      .andWhere('deleted_at', null)
      .first();
  }

  async update(
    id: string,
    dto: UpdateChannelDto,
    knex = this.knex,
  ): Promise<IChannelInterface> {
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
