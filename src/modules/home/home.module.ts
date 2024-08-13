import { Module } from '@nestjs/common';
import { AssignController } from './home.controller';
import { StudentProfilesModule } from '../student-profiles/student-profiles.module';
import { ChannelModule } from '../channel/channel.module';
import { StreaksModule } from '../streaks/streaks.module';
import { TransactionModule } from '../transaction/transaction.module';
import { FullStreaksModule } from '../full-streaks/full-streaks.module';
import { HomeService } from './home.service';
import { LevelModule } from '../level/level.module';
import { BadgeModule } from '../badge/badge.module';
import { AchievementsModule } from '../achievements/achievements.module';
import { MarketProductsModule } from '../market-products/market-products.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    StudentProfilesModule,
    ChannelModule,
    StreaksModule,
    TransactionModule,
    FullStreaksModule,
    LevelModule,
    BadgeModule,
    AchievementsModule,
    MarketProductsModule,
    FileModule,
  ],
  controllers: [AssignController],
  providers: [HomeService],
})
export class HomeModule {}
