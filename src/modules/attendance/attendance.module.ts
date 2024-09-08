import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { AttendanceRepo } from './repo/attendance.repo';
import { StudentProfilesModule } from '../student-profiles/student-profiles.module';
import { StreaksModule } from '../streaks/streaks.module';
import { TransactionModule } from '../transaction/transaction.module';
import { LevelModule } from '../level/level.module';

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
export class AttendanceModule {}
