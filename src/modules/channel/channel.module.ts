import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { BadgeModule } from '../badge/badge.module';
import { ChannelRepo } from './repo/channel.repo';
import { ChannelCategoriesModule } from '../channel_categories/channel-categories.module';
import { StudentProfilesModule } from '../student-profiles/student-profiles.module';
import { MarketProductsModule } from '../market-products/market-products.module';

@Module({
  imports: [MarketProductsModule, BadgeModule, ChannelCategoriesModule, StudentProfilesModule],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelRepo],
  exports: [ChannelService],
})
export class ChannelModule {}
