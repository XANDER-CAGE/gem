import { Module } from '@nestjs/common';
import { MarketCategoriesService } from './market-categories.service';
import { MarketCategoriesController } from './market-categories.controller';

@Module({
  controllers: [MarketCategoriesController],
  providers: [MarketCategoriesService],
})
export class MarketCategoriesModule {}
