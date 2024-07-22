import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { BadgeModule } from '../badge/badge.module';
import { ChannelRepo } from './repo/channel.repo';
import { ChannelCategoriesModule } from '../channel_categories/channel-categories.module';
import { StreaksModule } from '../streaks/streaks.module';
import { StudentProfilesModule } from '../student-profiles/student-profiles.module';

@Module({
  imports: [
    BadgeModule,
    ChannelCategoriesModule,
    StreaksModule,
    StudentProfilesModule,
  ],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelRepo],
  exports: [ChannelService, ChannelRepo],
})
export class ChannelModule {}
