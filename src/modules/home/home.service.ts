import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { StudentProfilesService } from '../student-profiles/student-profiles.service';
import { ChannelService } from '../channel/channel.service';
import { AssignChannelDto } from './dto/assign-channel.dto';
import { TransactionService } from '../transaction/transaction.service';
import { StreaksService } from '../streaks/streaks.service';
import { IAssignChannelArg } from '../channel/interface/channel.interface';
import { CreateEarningDto } from '../transaction/dto/create-earning-transaction.dto';
import { ChannelEntity } from '../channel/entity/channel.entity';
import { FullStreaksService } from '../full-streaks/full-streaks.service';
import { TopListTypeEnum } from './enum/top-list.enum';
import { LimitWithTopListDto } from './dto/home.dto';

@Injectable()
export class HomeService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly profileService: StudentProfilesService,
    private readonly channelService: ChannelService,
    private readonly transactionService: TransactionService,
    private readonly streakService: StreaksService,
    private readonly fullStreakService: FullStreaksService,
  ) {}

  async assignChannel(dto: AssignChannelDto) {
    const profile = await this.profileService.findOne(dto.profile_id);
    if (!profile) throw new NotFoundException('Student profile not found');
    let totalGem = +profile.gem;
    const channel = await this.channelService.findOne(dto.channel_id);
    if (!channel) throw new NotFoundException('Channel not found');
    totalGem += +channel.reward_gem;
    const streak = await this.calculateStreak(channel, profile.id);
    console.log('STREAK', streak);

    if (streak) totalGem += +streak.streak_reward;
    return channel;
    const streakId = streak ? streak.id : null;
    await this.knex.transaction(async (trx) => {
      const assignChannelToProfileArg: IAssignChannelArg = {
        channel_id: channel.id,
        streak_id: streakId,
        profile_id: profile.id,
        is_done: true,
      };
      await this.channelService.connectToProfile(
        assignChannelToProfileArg,
        trx,
      );
      const createEarningArg: CreateEarningDto = {
        channel_id: channel.id,
        streak_id: streakId,
        profile_id: profile.id,
      };
      await this.transactionService.createEarning(createEarningArg);
      await this.profileService.update(profile.id, { gem: totalGem }, trx);
    });
    // const earning = await this.transactionService.sumAllEarning(profile.id);
    return 'chlen';
  }

  async calculateStreak(channel: ChannelEntity, profileId: string) {
    const lastFailedChannel = await this.channelService.getLastFailedChannel(
      profileId,
      channel.id,
    );
    const lastFullStreak = await this.fullStreakService.getLastFullStreak(
      profileId,
      channel.id,
    );
    let startStreakDate: Date;
    if (lastFailedChannel && lastFailedChannel) {
      startStreakDate =
        new Date(lastFullStreak.joined_at) >
        new Date(lastFailedChannel.created_at)
          ? new Date(lastFullStreak.joined_at)
          : new Date(lastFailedChannel.created_at);
    } else {
    }
    const successChannelCount = await this.channelService.countAfterFail(
      profileId,
      channel.id,
      new Date(startStreakDate),
    );
    const streak = await this.streakService.findOneByChannelId(
      channel.id,
      successChannelCount + 1,
    );
    return streak;
  }

  async listOfLeadership(dto: LimitWithTopListDto) {
    if (dto.listType === TopListTypeEnum.STUDENT_TOP_BY_GEM) {
      return await this.profileService.findTopList(dto.limit);
    } else {
      return await this.transactionService.listTopEarning(dto.limit);
    }
  }
}
