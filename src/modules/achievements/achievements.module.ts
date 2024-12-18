import { Module } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { AchievementsRepo } from './repo/achievements.repo';
import { StudentProfilesModule } from '../student-profiles/student-profiles.module';
import { BadgeModule } from '../badge/badge.module';
import { TransactionModule } from '../transaction/transaction.module';
import { LevelModule } from '../level/level.module';

@Module({
  imports: [StudentProfilesModule, BadgeModule, TransactionModule, LevelModule],
  controllers: [AchievementsController],
  providers: [AchievementsService, AchievementsRepo],
  exports: [AchievementsService],
})
export class AchievementsModule {}
