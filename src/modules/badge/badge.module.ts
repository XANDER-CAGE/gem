import { Module } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { BadgeController } from './badge.controller';
import { BadgeRepo } from './repo/badge.repo';

@Module({
  controllers: [BadgeController],
  providers: [BadgeService, BadgeRepo],
  exports: [BadgeService],
})
export class BadgeModule {}
