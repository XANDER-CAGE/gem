import { Module } from '@nestjs/common';
import { ProductReviewsService } from './product-reviews.service';
import { ProductReviewsController } from './product-reviews.controller';
import { ProductReviewsRepo } from './repo/product-reviews.repo';
import { StudentsRepo } from '../students/repo/students.repo';
import { MarketRepo } from '../market/repo/market.repo';
import { StudentsModule } from '../students/students.module';
import { MarketModule } from '../market/market.module';

@Module({
  imports: [StudentsModule, MarketModule],
  controllers: [ProductReviewsController],
  providers: [ProductReviewsService, ProductReviewsRepo],
})
export class ProductReviewsModule {}
