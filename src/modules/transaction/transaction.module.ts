import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionRepo } from './repo/transaction.repo';
import { StudentProfilesModule } from '../student-profiles/student-profiles.module';
import { ChannelModule } from '../channel/channel.module';
import { StreaksModule } from '../streaks/streaks.module';
import { MarketProductsModule } from '../market-products/market-products.module';

@Module({
  imports: [StudentProfilesModule, ChannelModule, StreaksModule, MarketProductsModule],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepo],
})
export class TransactionModule {}
