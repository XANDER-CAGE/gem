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
import { ChannelModule } from './modules/channel/channel.module';
import { BadgeModule } from './modules/badge/badge.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { LevelModule } from './modules/level/level.module';
import { FullStreaksModule } from './modules/full-streaks/full-streaks.module';
import { ChannelCategoriesModule } from './modules/channel_categories/channel-categories.module';
import { HomeModule } from './modules/home/home.module';

//leadership module
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
    ProductReviewsModule,
    MarketCategoriesModule,
    ChannelModule,
    BadgeModule,
    TransactionModule,
    LevelModule,
    FullStreaksModule,
    ChannelCategoriesModule,
    HomeModule,
  ],
})
export class AppModule {}
