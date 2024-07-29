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
import { LevelService } from '../level/level.service';

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
  ) {}

  async assignChannel(dto: AssignChannelDto) {
    let streakId = null;
    let totalGem = 0;
    const profile = await this.profileService.findOne(dto.profile_id);
    if (!profile) throw new NotFoundException('Student profile not found');
    totalGem = +profile.gem;
    const channel = await this.channelService.findOne(dto.channel_id);
    if (!channel) throw new NotFoundException('Channel not found');
    totalGem += +channel.reward_gem;
    await this.knex.transaction(async (trx) => {
      if (channel.has_streak) {
        const streak = await this.calculateStreak(channel, profile.id, trx);
        if (streak) {
          totalGem += +streak.streak_reward;
          streakId = streak.id;
          if (streak.is_last) {
            const lastFullStreak =
              await this.fullStreakService.getLastFullStreak(
                profile.id,
                channel.id,
                trx,
              );
            await this.fullStreakService.assignFullStreak(
              profile.id,
              channel.id,
              lastFullStreak?.level + 1 || 1,
              trx,
            );
          }
        }
      }
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
      const levels = await this.levelService.connectToProfile(
        profile.id,
        totalGem,
      );
      
      await this.transactionService.createEarning(createEarningArg, trx);
      await this.profileService.update(profile.id, { gem: totalGem }, trx);
    });
    // const earning = await this.transactionService.sumAllEarning(profile.id);
    return 'chlen';
  }

  async calculateStreak(
    channel: ChannelEntity,
    profileId: string,
    knex = this.knex,
  ) {
    const lastFailedChannel = await this.channelService.getLastFailedChannel(
      profileId,
      channel.id,
      knex,
    );

    const lastFullStreak = await this.fullStreakService.getLastFullStreak(
      profileId,
      channel.id,
      knex,
    );
    console.log('Last FULL STREAk', lastFullStreak);
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
    console.log('START STREAK DATE', startStreakDate);
    const successChannelCount = await this.channelService.countAfterFail(
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
}
