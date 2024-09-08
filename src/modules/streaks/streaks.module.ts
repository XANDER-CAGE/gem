import { Module } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { StreaksController } from './streaks.controller';
import { StreaksRepo } from './repo/streaks.repo';

@Module({
  controllers: [StreaksController],
  providers: [StreaksService, StreaksRepo],
  exports: [StreaksService],
})
export class StreaksModule {}
