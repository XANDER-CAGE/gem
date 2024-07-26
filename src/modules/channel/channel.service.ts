import { Injectable, NotFoundException } from '@nestjs/common';
import { ChannelRepo } from './repo/channel.repo';
import { BadgeService } from '../badge/badge.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  IAssignChannelArg,
  IFindAllChannel,
} from './interface/channel.interface';
import { CreateChannelDto } from './dto/channel-create.dto';
import { UpdateChannelDto } from './dto/channel-update.dto';
import { ChannelCategoriesService } from '../channel_categories/channel-categories.service';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { ChannelEntity } from './entity/channel.entity';

@Injectable()
export class ChannelService {
  constructor(
    private readonly channelRepo: ChannelRepo,
    private readonly channelCategoriesService: ChannelCategoriesService,
    private readonly badgeService: BadgeService,
    @InjectConnection() private readonly knex: Knex,
  ) {}
  async create(createChannelDto: CreateChannelDto) {
    const { badge_id: badgeId, channel_category_id: channelCategoriesId } =
      createChannelDto;
    if (badgeId) {
      const badge = await this.badgeService.findOne(badgeId);
      if (!badge) throw new NotFoundException('Badge not found');
    }
    if (channelCategoriesId) {
      const channel_categories =
        await this.channelCategoriesService.findOne(channelCategoriesId);
      if (!channel_categories)
        throw new NotFoundException('Channel categories not found');
    }

    return this.channelRepo.create(createChannelDto);
  }

  async findAll(findAllChannelDto: PaginationDto): Promise<IFindAllChannel> {
    return this.channelRepo.findAll(findAllChannelDto);
  }

  async findOne(id: string): Promise<ChannelEntity> {
    return await this.channelRepo.findOne(id);
  }

  async update(id: string, updateChannelDto: UpdateChannelDto) {
    const { badge_id: badgeId, channel_category_id: channelCategoriesId } =
      updateChannelDto;
    if (badgeId) {
      const badge = await this.badgeService.findOne(badgeId);
      if (!badge) throw new NotFoundException('Badge not found');
    }
    if (channelCategoriesId) {
      const channel_categories =
        await this.channelCategoriesService.findOne(channelCategoriesId);
      if (!channel_categories)
        throw new NotFoundException('Channel categories not found');
    }
    return this.channelRepo.update(id, updateChannelDto);
  }

  async remove(id: string) {
    await this.channelRepo.delete(id);
  }

  async connectToProfile(arg: IAssignChannelArg, knex = this.knex) {
    return await this.channelRepo.connectToProfile(arg, knex);
  }

  async getLastFailedChannel(
    profileId: string,
    channelId: string,
    knex = this.knex,
  ) {
    return await this.channelRepo.getLastFailedChannel(
      profileId,
      channelId,
      knex,
    );
  }

  async countAfterFail(
    profileId: string,
    channelId: string,
    date: Date,
    knex = this.knex,
  ) {
    return await this.channelRepo.countAfterFail(
      profileId,
      channelId,
      date,
      knex,
    );
  }
}
