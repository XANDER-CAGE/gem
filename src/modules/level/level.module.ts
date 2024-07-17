import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { BadgeModule } from '../badge/badge.module';
import { LevelRepo } from './repo/level.repo';

@Module({
  imports: [BadgeModule],
  controllers: [LevelController],
  providers: [LevelService, LevelRepo],
  exports: [LevelService],
})
export class LevelModule {}
