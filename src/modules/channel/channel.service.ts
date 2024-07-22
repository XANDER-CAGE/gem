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
import { AssignChannelDto } from './dto/assign-channel.dto';
import { StudentProfilesService } from '../student-profiles/student-profiles.service';
import { StreaksService } from '../streaks/streaks.service';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class ChannelService {
  constructor(
    private readonly channelRepo: ChannelRepo,
    private readonly channelCategoriesService: ChannelCategoriesService,
    private readonly badgeService: BadgeService,
    private readonly profileService: StudentProfilesService,
    private readonly streakService: StreaksService,
    private readonly transactionService: TransactionService,
    @InjectConnection() private readonly knex: Knex,
  ) {}
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

  async assign(dto: AssignChannelDto) {
    const profile = await this.profileService.findOne(dto.student_profile_id);
    if (!profile) throw new NotFoundException('Student profile not found');
    const channel = await this.findOne(dto.channel_id);
    if (!channel) throw new NotFoundException('Channel not found');
    const streak = await this.getStreak(channel.id);
    const streakId = streak ? streak.id : null;
    const assignChannelToProfileArg: IAssignChannelArg = {
      channel_id: channel.id,
      streak_id: streakId,
      profile_id: profile.id,
    };
    await this.channelRepo.assignProfile(assignChannelToProfileArg, this.knex);
    const earning = await this.transactionService.sumAllEarning(profile.id);
  }

  // TODO: Implement logic
  async getStreak(channelId: string) {
    return await this.streakService.findOneByChannelId(channelId);
  }
}
