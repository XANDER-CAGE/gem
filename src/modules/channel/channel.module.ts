import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { BadgeModule } from '../badge/badge.module';
import { ChannelRepo } from './repo/channel.repo';
import { StudentProfilesModule } from '../student-profiles/student-profiles.module';

@Module({
  imports: [BadgeModule, StudentProfilesModule],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelRepo],
  exports: [ChannelService],
})
export class ChannelModule {}
