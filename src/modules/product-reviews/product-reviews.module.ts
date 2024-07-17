import { Module } from '@nestjs/common';
import { ProductReviewsService } from './product-reviews.service';
import { ProductReviewsController } from './product-reviews.controller';
import { ProductReviewsRepo } from './repo/product-reviews.repo';
import { MarketModule } from '../market/market.module';

@Module({
  imports: [MarketModule],
  controllers: [ProductReviewsController],
  providers: [ProductReviewsService, ProductReviewsRepo],
})
export class ProductReviewsModule {}
