import { Module } from '@nestjs/common';
import { MarketProductsController } from './market-products.controller';
import { ProductsService } from './market-products.service';
import { ProductRepo } from './repo/market-products.repo';
import { MarketCategoriesModule } from '../market-categories/market-categories.module';
import { MarketModule } from '../market/market.module';

@Module({
  imports: [MarketCategoriesModule, MarketModule],
  controllers: [MarketProductsController],
  providers: [ProductsService, ProductRepo],
  exports: [ProductsService],
})
export class MarketProductsModule {}
