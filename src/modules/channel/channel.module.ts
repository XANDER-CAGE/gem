import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { BadgeRepo } from '../badge/repo/badge.repo';
import { BadgeModule } from '../badge/badge.module';

@Module({
  imports: [BadgeModule],
  controllers: [ChannelController],
  providers: [ChannelService, BadgeRepo],
})
export class ChannelModule {}
