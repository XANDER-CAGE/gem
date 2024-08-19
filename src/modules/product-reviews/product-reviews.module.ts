import { Module } from '@nestjs/common';
import { ProductReviewsService } from './product-reviews.service';
import { ProductReviewsController } from './product-reviews.controller';
import { ProductReviewsRepo } from './repo/product-reviews.repo';
import { MarketProductsModule } from '../market-products/market-products.module';
import { StudentProfilesModule } from '../student-profiles/student-profiles.module';

@Module({
  imports: [MarketProductsModule, StudentProfilesModule],
  controllers: [ProductReviewsController],
  providers: [ProductReviewsService, ProductReviewsRepo],
})
export class ProductReviewsModule {}
