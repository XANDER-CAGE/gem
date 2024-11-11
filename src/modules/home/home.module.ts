import { Module } from '@nestjs/common';
import { StudentProfilesModule } from '../student-profiles/student-profiles.module';
import { StreaksModule } from '../streaks/streaks.module';
import { TransactionModule } from '../transaction/transaction.module';
import { HomeService } from './home.service';
import { LevelModule } from '../level/level.module';
import { BadgeModule } from '../badge/badge.module';
import { AchievementsModule } from '../achievements/achievements.module';
import { MarketProductsModule } from '../market-products/market-products.module';
import { FileModule } from '../file/file.module';
import { AssignmentRepo } from './repo/assignment.repo';
import { HomeController } from './home.controller';
import { LeadershipModule } from '../leadership/leadership.module';
import { AttendanceModule } from '../attendance/attendance.module';

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
export class HomeModule {}
