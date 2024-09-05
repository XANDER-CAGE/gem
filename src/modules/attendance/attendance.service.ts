import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AssignChannelDto } from './dto/assign-channel.dto';
import { StudentProfilesService } from '../student-profiles/student-profiles.service';
import { AttendanceRepo } from './repo/attendance.repo';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { StreaksService } from '../streaks/streaks.service';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly profileService: StudentProfilesService,
    private readonly attendanceRepo: AttendanceRepo,
    private readonly streakService: StreaksService,
  ) {}
  async assignChannel(dto: AssignChannelDto) {
    const profile = await this.profileService.findOne(dto.profile_id);
    if (!profile) throw new NotFoundException('Student profile not found');
    if (!dto.is_done) {
      await this.attendanceRepo.create({
        is_last_streak: false,
        streak_id: null,
        student_id: profile.student_id,
        success: false,
      });
      return CoreApiResponse.success(null);
    }
    let streakId = null;
    let totalGem = 0;
    totalGem = +profile.gem;
    await this.knex.transaction(async (trx) => {
      const startDate = await this.attendanceRepo.findStreakStartDate(
        profile.id,
        trx,
      );
      const successCount = await this.attendanceRepo.countSuccess(
        profile.id,
        startDate,
        trx,
      );
      
      if (channel.has_streak) {
        const streak = await this.streakService.calculateStreak(
          channel.id,
          profile.id,
          1,
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
          await this.transactionService.createEarning(
            {
              profile_id: profile.id,
              level_id: level.id,
              total_gem: level.free_gem,
            },
            trx,
          );
        }
      }
      await this.profileService.update(profile.id, { gem: totalGem }, trx);
    });
    return CoreApiResponse.success(null);
  }

  findAll() {
    return `This action returns all attendance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attendance`;
  }

  update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    return `This action updates a #${id} attendance`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendance`;
  }
}
