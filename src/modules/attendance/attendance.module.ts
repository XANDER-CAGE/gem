import { Module } from '@nestjs/common';
import { LevelModule } from '../level/level.module';
import { StreaksModule } from '../streaks/streaks.module';
import { StudentProfilesModule } from '../student-profiles/student-profiles.module';
import { TransactionModule } from '../transaction/transaction.module';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { AttendanceRepo } from './repo/attendance.repo';

@Module({
  imports: [
    StudentProfilesModule,
    StreaksModule,
    TransactionModule,
    LevelModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, AttendanceRepo],
  exports: [AttendanceService],
})
export class AttendanceModule { }
