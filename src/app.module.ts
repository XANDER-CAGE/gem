import { Module } from '@nestjs/common';
import { KnexModule } from 'nest-knexjs';
import { KnexConfigService } from './common/config/knex.config';
import { UsersModule } from './modules/users/users.module';
import { MarketModule } from './modules/market/market.module';
import { StreaksModule } from './modules/streaks/streaks.module';
import { StudentProfilesModule } from './modules/student-profiles/student-profiles.module';
import { MarketProductsModule } from './modules/market-products/market-products.module';
import { ProductReviewsModule } from './modules/product-reviews/product-reviews.module';
import { MarketCategoriesModule } from './modules/market-categories/market-categories.module';
import { BadgeModule } from './modules/badge/badge.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { LevelModule } from './modules/level/level.module';
import { HomeModule } from './modules/home/home.module';
import { AchievementsModule } from './modules/achievements/achievements.module';
import { LeadershipModule } from './modules/leadership/leadership.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guard/auth.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { FileModule } from './modules/file/file.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { CartModule } from './modules/cart/cart.module';

//leadership module
@Module({
  imports: [
    ScheduleModule.forRoot(),
    KnexModule.forRootAsync({
      useClass: KnexConfigService,
    }),
    UsersModule,
    MarketModule,
    StreaksModule,
    StudentProfilesModule,
    MarketProductsModule,
    ProductReviewsModule,
    MarketCategoriesModule,
    BadgeModule,
    TransactionModule,
    LevelModule,
    HomeModule,
    AchievementsModule,
    LeadershipModule,
    FileModule,
    AttendanceModule,
    CartModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
