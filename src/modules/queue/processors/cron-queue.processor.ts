import { Processor, Process } from '@nestjs/bull';
import { CRON_QUEUE_NAME } from '../constant/cron-queue-name';
import { CronProcessNames } from '../enum/process-name.enum';
import { LeadershipService } from 'src/modules/leadership/leadership.service';
import { AttendanceService } from 'src/modules/attendance/attendance.service';
import { HomeService } from 'src/modules/home/home.service';

@Processor(CRON_QUEUE_NAME)
export class CronProcessor {
  constructor(
    private readonly leadershipService: LeadershipService,
    private readonly attendanceService: AttendanceService,
    private readonly homeService: HomeService,
  ) {}
  @Process(CronProcessNames.ATTENDANCE)
  async attendanceCron() {
    await this.attendanceService.attendanceCron();
  }

  @Process(CronProcessNames.GET_GRADES)
  async getGradesCron() {
    await this.homeService.handleGradeCron();
  }

  @Process(CronProcessNames.SAVE_LEADERSHIP)
  async saveLeadershipCron() {
    await this.leadershipService.saveLeadership();
  }
}
