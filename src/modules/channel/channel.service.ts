import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ChannelRepo } from './repo/channel.repo';
import { BadgeService } from '../badge/badge.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IFindAllChannel } from './interface/channel.interface';
import { CreateChannelDto } from './dto/channel-create.dto';
import { UpdateChannelDto } from './dto/channel-update.dto';
import { ChannelCategoriesService } from '../channel_categories/channel-categories.service';

@Injectable()
export class ChannelService {
  @Inject() private readonly channelRepo: ChannelRepo;
  @Inject() private readonly badgeService: BadgeService;
  @Inject() private readonly channelCategoriesService: ChannelCategoriesService;

  async create(createChannelDto: CreateChannelDto) {
    const { badge_id: badgeId, channel_categories_id: channelCategoriesId } =
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

  async findOne(id: string) {
    return await this.channelRepo.findOne(id);
  }

  async update(id: string, updateChannelDto: UpdateChannelDto) {
    const { badge_id: badgeId, channel_categories_id: channelCategoriesId } =
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
}
