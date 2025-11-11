import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { KnexModule } from 'nest-knexjs';
import { KnexConfigService } from './common/config/knex.config';
import { AuthGuard } from './common/guard/auth.guard';
import { AchievementsModule } from './modules/achievements/achievements.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { BadgeModule } from './modules/badge/badge.module';
import { CartModule } from './modules/cart/cart.module';
import { FileModule } from './modules/file/file.module';
import { HomeModule } from './modules/home/home.module';
import { LeadershipModule } from './modules/leadership/leadership.module';
import { LevelModule } from './modules/level/level.module';
import { MarketCategoriesModule } from './modules/market-categories/market-categories.module';
import { MarketProductsModule } from './modules/market-products/market-products.module';
import { MarketModule } from './modules/market/market.module';
import { ProductReviewsModule } from './modules/product-reviews/product-reviews.module';
import { StreaksModule } from './modules/streaks/streaks.module';
import { StudentProfilesModule } from './modules/student-profiles/student-profiles.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { UsersModule } from './modules/users/users.module';


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
export class AppModule { }
