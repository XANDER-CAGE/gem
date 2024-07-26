import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { LevelRepo } from './repo/level.repo';
import { BadgeModule } from '../badge/badge.module';

@Module({
  imports: [BadgeModule],
  controllers: [LevelController],
  providers: [LevelService, LevelRepo],
  exports: [LevelService],
})
export class LevelModule {}
