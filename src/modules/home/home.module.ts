import { Module } from '@nestjs/common';
import { AchievementsModule } from '../achievements/achievements.module';
import { AttendanceModule } from '../attendance/attendance.module';
import { BadgeModule } from '../badge/badge.module';
import { FileModule } from '../file/file.module';
import { LeadershipModule } from '../leadership/leadership.module';
import { LevelModule } from '../level/level.module';
import { MarketProductsModule } from '../market-products/market-products.module';
import { StreaksModule } from '../streaks/streaks.module';
import { StudentProfilesModule } from '../student-profiles/student-profiles.module';
import { TransactionModule } from '../transaction/transaction.module';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { AssignmentRepo } from './repo/assignment.repo';

@Module({
  imports: [
    StudentProfilesModule,
    StreaksModule,
    TransactionModule,
    LevelModule,
    BadgeModule,
    AchievementsModule,
    MarketProductsModule,
    FileModule,
    LeadershipModule,
    AttendanceModule,
  ],
  controllers: [HomeController],
  providers: [HomeService, AssignmentRepo],
  exports: [HomeService],
})
export class HomeModule { }
