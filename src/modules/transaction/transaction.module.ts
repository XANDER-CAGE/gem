import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionRepo } from './repo/transaction.repo';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepo],
})
export class TransactionModule {}
