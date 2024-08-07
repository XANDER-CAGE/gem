import { Injectable } from '@nestjs/common';
import { ChannelRepo } from './repo/channel.repo';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  IAssignChannelArg,
  IFindAllChannel,
  IUpdateRelationToProfile,
} from './interface/channel.interface';
import { CreateChannelDto } from './dto/channel-create.dto';
import { UpdateChannelDto } from './dto/channel-update.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { ChannelEntity } from './entity/channel.entity';

@Injectable()
export class ChannelService {
  constructor(
    private readonly channelRepo: ChannelRepo,
    @InjectConnection() private readonly knex: Knex,
  ) {}

  async create(createChannelDto: CreateChannelDto) {
    return this.channelRepo.create(createChannelDto);
  }

  async findAll(findAllChannelDto: PaginationDto): Promise<IFindAllChannel> {
    return this.channelRepo.findAll(findAllChannelDto);
  }

  async findOne(id: string): Promise<ChannelEntity> {
    return await this.channelRepo.findOne(id);
  }

  async update(id: string, updateChannelDto: UpdateChannelDto) {
    return this.channelRepo.update(id, updateChannelDto);
  }

  async remove(category_id: string) {
    await this.channelRepo.delete(category_id);
  }

  async connectToProfile(arg: IAssignChannelArg, knex = this.knex) {
    return await this.channelRepo.connectToProfile(arg, knex);
  }

  async getLastUnderdoneChannel(
    profileId: string,
    channelId: string,
    knex = this.knex,
  ) {
    return await this.channelRepo.getLastUnderdoneChannel(
      profileId,
      channelId,
      knex,
    );
  }

  async countSuccessChannel(
    profileId: string,
    channelId: string,
    date = new Date(),
    knex = this.knex,
  ) {
    return await this.channelRepo.countSuccessChannel(
      profileId,
      channelId,
      date,
      knex,
    );
  }

  async updateRelationToProfile(dto: IUpdateRelationToProfile) {
    return await this.channelRepo.updateRelationToProfile(dto);
  }

  async getByCategoryId(categoryId: string) {
    return await this.channelRepo.getByCategoryId(categoryId);
  }
}
