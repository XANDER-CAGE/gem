import { Module } from '@nestjs/common';
import { FullStreaksService } from './full-streaks.service';
import { FullStreaksController } from './full-streaks.controller';
import { FullStreakRepo } from './repo/full-streak.repo';
import { MarketProductsModule } from '../market-products/market-products.module';
import { ChannelModule } from '../channel/channel.module';
import { BadgeModule } from '../badge/badge.module';

@Module({
  imports: [MarketProductsModule, ChannelModule, BadgeModule],
  controllers: [FullStreaksController],
  providers: [FullStreaksService, FullStreakRepo],
  exports: [FullStreaksService],
})
export class FullStreaksModule {}
