import { Module } from '@nestjs/common';
import { MarketCategoriesService } from './market-categories.service';
import { MarketCategoriesController } from './market-categories.controller';
import { MarketCategoriesRepo } from './repo/market-categories.repo';

@Module({
  controllers: [MarketCategoriesController],
  providers: [MarketCategoriesService, MarketCategoriesRepo],
  exports: [MarketCategoriesService],
})
export class MarketCategoriesModule {}
