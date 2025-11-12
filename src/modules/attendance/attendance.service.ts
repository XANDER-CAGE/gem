import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { LevelService } from '../level/level.service';
import { StreaksService } from '../streaks/streaks.service';
import { StudentProfilesService } from '../student-profiles/student-profiles.service';
import { TransactionService } from '../transaction/transaction.service';
import { AttendanceRepo } from './repo/attendance.repo';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly profileService: StudentProfilesService,
    private readonly attendanceRepo: AttendanceRepo,
    private readonly streakService: StreaksService,
    private readonly transactionService: TransactionService,
    private readonly levelService: LevelService,
  ) { }
  async assignAttendance(studentId: string, isDone: boolean) {
    try {
      const profile = await this.profileService.getProfileByColumn(
        'student_id',
        studentId,
      );
      if (!profile) {
        throw new NotFoundException('Student not registered in gamification');
      }
      if (!isDone) {
        await this.attendanceRepo.create({
          is_last_streak: false,
          streak_id: null,
          profile_id: profile.id,
          success: false,
        });
        return CoreApiResponse.success(null);
      }
      let totalGem = +profile.gem || 0;
      await this.knex.transaction(async (trx) => {
        const startDate = await this.attendanceRepo.findStreakStartDate(
          profile.id,
          trx,
        );
        const successCount = await this.attendanceRepo.countSuccess(
          profile.id,
          startDate ? new Date(startDate) : new Date('1970'),
          trx,
        );
        const streak = await this.streakService.findOneByLevel(
          +successCount + 1,
          trx,
        );
        if (streak && streak?.streak_reward) {
          await this.transactionService.createEarning({
            profile_id: profile.id,
            streak_id: streak.id,
            total_gem: streak.streak_reward,
          });
          totalGem += streak.streak_reward;
        }
        await this.attendanceRepo.create(
          {
            is_last_streak: streak.is_last,
            streak_id: streak.id,
            profile_id: profile.id,
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
          totalEarned + totalGem,
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
    } catch (error) {
      console.log(error.message);
    }
  }

  private async getAttendances() {
    const date = new Date();
    const data = date.toISOString().split('T')[0];
    const response = await axios.post(
      // TODO: env
      'https://lms.eduplus.uz/api/attendance-v2/daily-strike-check-status',
      { day: data },
    );
    return response.data;
  }


  // @Cron('0 0 19 * * *', { timeZone: 'Asia/Tashkent', name: 'attendance' })
  async attendanceCron() {
    const datas = await this.getAttendances();
    console.log('DATA LENGTH: ', datas.length);
    for (const data of datas) {
      console.log(data.student_id)
      await this.assignAttendance(data.student_id, data.daily_strike_status);
    }
  }
}
