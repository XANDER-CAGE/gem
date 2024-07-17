import { Module } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { StreaksController } from './streaks.controller';
import { ChannelModule } from '../channel/channel.module';
import { StreaksRepo } from './repo/streaks.repo';

@Module({
  imports: [ChannelModule],
  controllers: [StreaksController],
  providers: [StreaksService, StreaksRepo],
  exports: [StreaksService],
})
export class StreaksModule {}
