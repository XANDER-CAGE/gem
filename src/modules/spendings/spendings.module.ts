import { Module } from '@nestjs/common';
import { SpendingsService } from './spendings.service';
import { SpendingsController } from './spendings.controller';

@Module({
  controllers: [SpendingsController],
  providers: [SpendingsService],
})
export class SpendingsModule {}
