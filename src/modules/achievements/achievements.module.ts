import { Module } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { AchievementsRepo } from './repo/achievements.repo';

@Module({
  controllers: [AchievementsController],
  providers: [AchievementsService, AchievementsRepo],
  exports: [AchievementsService],
})
export class AchievementsModule {}
