import { Injectable, NotFoundException } from '@nestjs/common';
import { AssignChannelDto } from './dto/assign-channel.dto';
import { StudentProfilesService } from '../student-profiles/student-profiles.service';
import { AttendanceRepo } from './repo/attendance.repo';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { StreaksService } from '../streaks/streaks.service';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { TransactionService } from '../transaction/transaction.service';
import { LevelService } from '../level/level.service';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly profileService: StudentProfilesService,
    private readonly attendanceRepo: AttendanceRepo,
    private readonly streakService: StreaksService,
    private readonly transactionService: TransactionService,
    private readonly levelService: LevelService,
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
    let totalGem = +profile.gem || 0;
    await this.knex.transaction(async (trx) => {
      const startDate = await this.attendanceRepo.findStreakStartDate(
        profile.student_id,
        trx,
      );
      console.log(startDate);
      
      const successCount = await this.attendanceRepo.countSuccess(
        profile.id,
        startDate,
        trx,
      );
      const streak = await this.streakService.findOneByLevel(
        successCount + 1,
        trx,
      );
      if (streak || streak?.streak_reward) {
        await this.transactionService.createEarning({
          profile_id: profile.id,
          streak_id: streak.id,
          total_gem: streak.streak_reward,
        });
        totalGem += streak.streak_reward;
      }
      await this.attendanceRepo.create(
        {
          is_last_streak: true,
          streak_id: streak.id,
          student_id: profile.student_id,
          success: true,
        },
        trx,
      );
      const totalEarned = await this.transactionService.sumAllEarning(
        profile.id,
        trx,
      );
      const levels = await this.levelService.connectReachedLevels(
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
}
