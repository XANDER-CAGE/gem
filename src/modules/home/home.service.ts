import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { StudentProfilesService } from '../student-profiles/student-profiles.service';
import { ChannelService } from '../channel/channel.service';
import { AssignChannelDto } from './dto/assign-channel.dto';
import { TransactionService } from '../transaction/transaction.service';
import { StreaksService } from '../streaks/streaks.service';
import { CreateEarningDto } from '../transaction/dto/create-earning-transaction.dto';
import { ChannelEntity } from '../channel/entity/channel.entity';
import { FullStreaksService } from '../full-streaks/full-streaks.service';
import { LevelService } from '../level/level.service';
import { ChannelCategoriesService } from '../channel_categories/channel-categories.service';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { BadgeService } from '../badge/badge.service';

@Injectable()
export class HomeService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly profileService: StudentProfilesService,
    private readonly channelService: ChannelService,
    private readonly transactionService: TransactionService,
    private readonly streakService: StreaksService,
    private readonly fullStreakService: FullStreaksService,
    private readonly levelService: LevelService,
    private readonly chanCategoryService: ChannelCategoriesService,
    private readonly badgeService: BadgeService,
  ) {}

  async assignChannel(dto: AssignChannelDto) {
    const profile = await this.profileService.findOne(dto.profile_id);
    if (!profile) throw new NotFoundException('Student profile not found');
    const channel = await this.channelService.findOne(dto.channel_id);
    if (!channel) throw new NotFoundException('Channel not found');
    if (!dto.is_done) {
      return await this.channelService.connectToProfile({
        channel_id: channel.id,
        profile_id: profile.id,
        is_done: false,
      });
    }
    let streakId = null;
    let totalGem = 0;
    const transactions: CreateEarningDto[] = [];
    totalGem = +profile.gem;
    await this.knex.transaction(async (trx) => {
      channel.reward_gem &&
        transactions.push({
          profile_id: profile.id,
          channel_id: channel.id,
          total_gem: channel.reward_gem,
        });
      totalGem += +channel.reward_gem;
      if (channel.has_streak) {
        const streak = await this.calculateStreak(channel, profile.id);
        streakId = streak.id;
        if (streak?.streak_reward) {
          transactions.push({
            profile_id: profile.id,
            streak_id: streak.id,
            total_gem: streak.streak_reward,
          });
          totalGem += streak.streak_reward;
        }
        if (streak?.is_last) {
          const fullStreak = await this.fullStreakService.assignFullStreak(
            profile.id,
            channel.id,
            trx,
          );
          if (fullStreak?.reward_gem) {
            transactions.push({
              profile_id: profile.id,
              full_streak_id: fullStreak.id,
              total_gem: fullStreak.reward_gem,
            });
            totalGem += +fullStreak.reward_gem;
          }
        }
      }
      await this.channelService.connectToProfile({
        channel_id: channel.id,
        streak_id: streakId,
        profile_id: profile.id,
        is_done: true,
      });
      const totalEarned = await this.transactionService.sumAllEarning(
        profile.id,
        trx,
      );
      await this.transactionService.createEarning(transactions, trx);
      transactions.length = 0;
      console.log('TOTAL EARNED', totalEarned);
      const levels = await this.levelService.connectToProfile(
        profile.id,
        totalEarned || 0 + totalGem,
        trx,
      );
      for (const level of levels) {
        if (level.free_gem) {
          totalGem += +level.free_gem;
          transactions.push({
            profile_id: profile.id,
            level_id: level.id,
            total_gem: level.free_gem,
          });
        }
      }
      console.log(transactions.length);

      if (transactions.length) {
        await this.transactionService.createEarning(transactions, trx);
      }
      await this.profileService.update(profile.id, { gem: totalGem }, trx);
    });
    return null;
  }

  async calculateStreak(
    channel: ChannelEntity,
    profileId: string,
    knex = this.knex,
  ) {
    const lastFailedChannel = await this.channelService.getLastUnderdoneChannel(
      profileId,
      channel.id,
      knex,
    );
    const lastFullStreak = await this.fullStreakService.getLastFullStreak(
      profileId,
      channel.id,
      knex,
    );
    let startStreakDate: Date;
    if (lastFailedChannel && lastFullStreak) {
      startStreakDate =
        new Date(lastFullStreak.joined_at) >
        new Date(lastFailedChannel.created_at)
          ? new Date(lastFullStreak.joined_at)
          : new Date(lastFailedChannel.created_at);
    } else {
      startStreakDate = lastFailedChannel
        ? lastFailedChannel.created_at
        : lastFullStreak
          ? lastFullStreak.joined_at
          : new Date('1970');
    }
    const successChannelCount = await this.channelService.countSuccessChannel(
      profileId,
      channel.id,
      new Date(startStreakDate),
      knex,
    );
    const streak = await this.streakService.findOneByChannelId(
      channel.id,
      successChannelCount + 1,
      knex,
    );
    return streak;
  }

  async assignChannelCategory(channelCategoryId: string, profileId: string) {
    const category = await this.chanCategoryService.findOne(channelCategoryId);
    if (!category) throw new NotFoundException('Category not found');
    const profile = await this.profileService.findOne(profileId);
    if (!profile) throw new NotFoundException('Student profile not found');
    if (!category.is_serial) {
      const [channel] = await this.channelService.getByCategoryId(category.id);
      if (!channel) throw new NotFoundException('There is no any channel');
      const channelProgress = await this.channelService.getLastUnderdoneChannel(
        profileId,
        channel.id,
      );
      const channelsDone = await this.channelService.countSuccessChannel(
        profileId,
        channel.id,
      );
      if (channel.given_one_time && channelsDone >= 1) {
        throw new NotAcceptableException('Channel already done');
      }
      if (channel.progress == 1 || !channelProgress) {
        await this.assignChannel({
          channel_id: channel.id,
          profile_id: profileId,
          is_done: channel.progress == 1,
        });
        return CoreApiResponse.success(null);
      } else {
        await this.channelService.updateRelationToProfile({
          relationId: channelProgress.id,
          progress: ++channelProgress.progress,
          is_done: channelProgress.progress == channel.progress,
        });
        return CoreApiResponse.success(null);
      }
    } else {
    }
  }

  async assignBadge(badgeId: string, profileId: string, knex = this.knex) {
    const badge = await this.badgeService.findOne(badgeId);
    if (!badge) throw new NotFoundException('Badge not found');
    const profile = await this.profileService.findOne(profileId);
    if (!profile) throw new NotFoundException('Student profile not found');
    if(badge.reward_gem){
      
    }
  }
}
