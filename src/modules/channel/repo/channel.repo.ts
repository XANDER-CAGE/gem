import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { CreateChannelDto } from '../dto/channel.dto';
import { IChannelInterface } from '../interface/channel.interface';

export class ChannelRepo {
  private readonly table = 'channels';
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(dto: CreateChannelDto): Promise<IChannelInterface> {
    const [channel] = await this.knex
      .insert({
        ...dto,
      })
      .into(this.table)
      .returning('*');
    return channel;
  }

  async findAll():Promise<[IChannelInterface]> {
    return await this.knex
    .select('*')
    .from(this.table)
    .l
  }
}
