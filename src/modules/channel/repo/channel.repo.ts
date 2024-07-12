import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { CreateChannelDto, FindAllChannelDto } from '../dto/channel.dto';
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
      .limit(limit)
      .offset((page - 1) * limit)
      .as('c');
    const [{ total, data }] = await knex
      .select([
        knex.raw('(SELECT COUNT(id) FROM ??) AS total', this.table),
        knex.raw('jsonb_agg(c.*) AS data'),
      ])
      .from(innerQuery);

    return { total: +total, data };
  }
}
