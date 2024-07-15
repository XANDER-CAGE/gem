import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { MarketRepo } from './repo/market.repo';
import { MarketCategoriesModule } from '../market-categories/market-categories.module';

@Module({
  imports: [MarketCategoriesModule],
  controllers: [MarketController],
  providers: [MarketService, MarketRepo],
  exports: [MarketService]
})
export class MarketModule {}
