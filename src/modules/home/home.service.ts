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
import { FullStreaksService } from '../full-streaks/full-streaks.service';
import { LevelService } from '../level/level.service';
import { BadgeService } from '../badge/badge.service';
import { AchievementsService } from '../achievements/achievements.service';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';

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
    private readonly badgeService: BadgeService,
    private readonly achievementsService: AchievementsService,
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
    totalGem = +profile.gem;
    await this.knex.transaction(async (trx) => {
      try {
        if (channel.reward_gem) {
          await this.transactionService.createEarning({
            profile_id: profile.id,
            channel_id: channel.id,
            total_gem: channel.reward_gem,
          });
        }
        totalGem += +channel.reward_gem;
        if (channel.has_streak) {
          const streak = await this.streakService.calculateStreak(
            channel,
            profile.id,
            trx,
          );
          streakId = streak?.id;
          if (streak?.streak_reward) {
            await this.transactionService.createEarning({
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
              await this.transactionService.createEarning({
                profile_id: profile.id,
                full_streak_id: fullStreak.id,
                total_gem: fullStreak.reward_gem,
              });
              totalGem += +fullStreak.reward_gem;
            }
          }
        }
        await this.channelService.connectToProfile(
          {
            channel_id: channel.id,
            streak_id: streakId,
            profile_id: profile.id,
            is_done: true,
          },
          trx,
        );
        const totalEarned = await this.transactionService.sumAllEarning(
          profile.id,
          trx,
        );
        const levels = await this.levelService.connectToProfile(
          profile.id,
          totalEarned || 0 + totalGem,
          trx,
        );
        for (const level of levels) {
          if (level.free_gem) {
            totalGem += +level.free_gem;
            await this.transactionService.createEarning({
              profile_id: profile.id,
              level_id: level.id,
              total_gem: level.free_gem,
            });
          }
        }
        await this.profileService.update(profile.id, { gem: totalGem }, trx);
      } catch (error) {
        throw Error('Error assign channel');
      }
    });
    return CoreApiResponse.success(null);
  }

  async assignAchievement(
    profileId: string,
    achievementId: string,
    knex = this.knex,
  ) {
    const achievement = await this.achievementsService.findOne(achievementId);
    if (!achievement) throw new NotFoundException('Achievement not found');
    const profile = await this.profileService.findOne(profileId);
    if (!profile) throw new NotFoundException('Student profile not found');
    const { badge, user_progress, connection_id } =
      await this.badgeService.getUnderdoneBadge(profileId, achievementId);
    if (!badge) throw new NotAcceptableException('No more badges');
    await knex.transaction(async (trx) => {
      try {
        if (!user_progress) {
          await this.badgeService.connectToProfile(profileId, badge.id, 1, trx);
        } else {
          await this.badgeService.updateConnection(
            'progress',
            user_progress + 1,
            connection_id,
            trx,
          );
        }
        if (badge.reward_gem && badge.progress == user_progress + 1) {
          await this.transactionService.createEarning(
            {
              badge_id: badge.id,
              total_gem: badge.reward_gem,
              profile_id: profileId,
            },
            trx,
          );
          await this.profileService.update(
            profile.id,
            { gem: profile.gem + badge.reward_gem },
            trx,
          );
        }
      } catch (error) {
        throw new Error('Assign achievement error');
      }
    });
    return CoreApiResponse.success(null);
  }
}
