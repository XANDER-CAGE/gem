import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartRepo } from './repo/cart.repo';
import { HomeModule } from '../home/home.module';
import { StudentProfilesModule } from '../student-profiles/student-profiles.module';
import { MarketProductsModule } from '../market-products/market-products.module';

@Module({
  imports: [HomeModule, StudentProfilesModule, MarketProductsModule],
  controllers: [CartController],
  providers: [CartService, CartRepo],
})
export class CartModule {}
