import { Module } from '@nestjs/common';
import { KnexModule } from 'nest-knexjs';
import { KnexConfigService } from './common/config/knex.config';
import { UsersModule } from './modules/users/users.module';
import { MarketModule } from './modules/market/market.module';
import { StreaksModule } from './modules/streaks/streaks.module';
import { StudentProfilesModule } from './modules/student-profiles/student-profiles.module';
import { MarketProductsModule } from './modules/market-products/market-products.module';
import { StudentsModule } from './modules/students/students.module';
import { ProductReviewsModule } from './modules/product-reviews/product-reviews.module';
import { SpendingsModule } from './modules/spendings/spendings.module';
import { CourseModule } from './modules/course/course.module';
import { MarketCategoriesModule } from './modules/market-categories/market-categories.module';
import { FullStreaksModule } from './modules/full-streaks/full-streaks.module';

@Module({
  imports: [
    KnexModule.forRootAsync({
      useClass: KnexConfigService,
    }),
    UsersModule,
    MarketModule,
    StreaksModule,
    StudentProfilesModule,
    MarketProductsModule,
    StudentsModule,
    ProductReviewsModule,
    SpendingsModule,
    CourseModule,
    MarketCategoriesModule,
    FullStreaksModule,
  ],
})
export class AppModule {}
