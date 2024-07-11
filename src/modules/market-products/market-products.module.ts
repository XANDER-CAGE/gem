import { Module } from '@nestjs/common';
import { MarketProductsService } from './market-products.service';
import { MarketProductsController } from './market-products.controller';

@Module({
  controllers: [MarketProductsController],
  providers: [MarketProductsService],
})
export class MarketProductsModule {}
