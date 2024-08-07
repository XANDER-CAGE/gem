import { Module } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { StreaksController } from './streaks.controller';
import { StreaksRepo } from './repo/streaks.repo';
import { ChannelModule } from '../channel/channel.module';
import { FullStreaksModule } from '../full-streaks/full-streaks.module';

@Module({
  imports: [ChannelModule, FullStreaksModule],
  controllers: [StreaksController],
  providers: [StreaksService, StreaksRepo],
  exports: [StreaksService],
})
export class StreaksModule {}
