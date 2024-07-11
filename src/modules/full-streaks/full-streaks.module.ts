import { Module } from '@nestjs/common';
import { FullStreaksService } from './full-streaks.service';
import { FullStreaksController } from './full-streaks.controller';

@Module({
  controllers: [FullStreaksController],
  providers: [FullStreaksService],
})
export class FullStreaksModule {}
