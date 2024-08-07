import { IUpdateRelationToProfile } from './../interface/channel.interface';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ChannelEntity } from '../entity/channel.entity';
import {
  IAssignChannelArg,
  IFindAllChannel,
} from '../interface/channel.interface';
import { CreateChannelDto } from '../dto/channel-create.dto';
import { UpdateChannelDto } from '../dto/channel-update.dto';
import { tableName } from 'src/common/var/table-name.var';
import { ChannelsOnProfilesEntity } from '../entity/channels-on-profiles.entity';

export class ChannelRepo {
  private readonly table = tableName.channels;
  private readonly relationToProfiles = tableName.channelsM2Mprofiles;
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(
    dto: CreateChannelDto,
    knex = this.knex,
  ): Promise<ChannelEntity> {
    return await knex
      .insert({
        ...dto,
      })
      .into(this.table)
      .returning('*')
      .first();
  }

  async findAll(
    dto: PaginationDto,
    knex = this.knex,
  ): Promise<IFindAllChannel> {
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

    return { total: +total, data: data || [] };
  }

  async findOne(id: string, knex = this.knex): Promise<ChannelEntity> {
    return await knex
      .select(
        knex.raw([
          'c.*',
          'c.reward_gem::double precision as reward_gem',
          `case when s.id is not null then true else false end as has_streak`,
        ]),
      )
      .leftJoin(`${tableName.streaks} as s`, function () {
        this.on('s.channel_id', 'c.id').andOn(knex.raw('s.deleted_at is null'));
      })
      .from(`${this.table} as c`)
      .where('c.id', id)
      .andWhere('c.deleted_at', null)
      .first();
  }

  async update(
    id: string,
    dto: UpdateChannelDto,
    knex = this.knex,
  ): Promise<ChannelEntity> {
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

  async delete(category_id: string, knex = this.knex): Promise<void> {
    const maxResult = await knex(this.table)
      .max('level as max_level')
      .where('channel_category_id', category_id);
    const maxLevel = maxResult[0].max_level;

    await knex(this.table)
      .update({
        deleted_at: new Date(),
        updated_at: new Date(),
      })
      .where('channel_category_id', category_id)
      .where('level', maxLevel)
      .andWhere('deleted_at', null);
  }

  async connectToProfile(dto: IAssignChannelArg, knex = this.knex) {
    const [data] = await knex(this.relationToProfiles)
      .insert({ ...dto })
      .returning('*');
    return data;
  }

  async getProgress(profileId: string, channelId: string, knex = this.knex) {
    return knex
      .select('*')
      .from(this.relationToProfiles)
      .where('profile_id', profileId)
      .andWhere('channel_id', channelId);
  }

  async getLastUnderdoneChannel(
    profileId: string,
    channelId: string,
    knex = this.knex,
  ): Promise<ChannelsOnProfilesEntity> {
    return await knex(tableName.channelsM2Mprofiles)
      .select('*')
      .where('profile_id', profileId)
      .andWhere('channel_id', channelId)
      .andWhere('is_done', false)
      .orderBy('created_at', 'desc')
      .first();
  }

  async countSuccessChannel(
    profileId: string,
    channelId: string,
    date = new Date(),
    knex = this.knex,
  ): Promise<number> {
    const data: any = await knex(tableName.channelsM2Mprofiles)
      .select(knex.raw('count(id)::integer'))
      .where('profile_id', profileId)
      .andWhere('channel_id', channelId)
      .andWhere('is_done', true)
      .andWhereRaw(`joined_at > ?::timestamp`, [
        date.toISOString().replace('T', ' ').replace('Z', ''),
      ])
      .first();
    return data.count;
  }

  async getByCategoryId(
    categoryId: string,
    knex = this.knex,
  ): Promise<Omit<ChannelEntity, 'has_streak'>[]> {
    return knex(this.table)
      .select('*')
      .whereRaw('deleted_at is null')
      .andWhere('channel_category_id', categoryId);
  }

  async updateRelationToProfile(
    dto: IUpdateRelationToProfile,
    knex = this.knex,
  ) {
    const { relationId, ...columns } = dto;
    return knex(this.relationToProfiles)
      .update({
        ...columns,
        updated_at: new Date(),
      })
      .where('id', relationId)
      .andWhereRaw('deleted_at is not null');
  }

  // async getDoneChannel(
  //   profileId: string,
  //   channelId: string,
  //   knex = this.knex,
  // ) {
  //   return
  // }
}
