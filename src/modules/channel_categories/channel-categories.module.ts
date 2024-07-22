import { Module } from '@nestjs/common';
import { ChannelCategoriesService } from './channel-categories.service';
import { ChannelCategoriesController } from './channel-categories.controller';
import { ChannelCategoriesRepo } from './repo/channel-categories.repo';

@Module({
  controllers: [ChannelCategoriesController],
  providers: [ChannelCategoriesService, ChannelCategoriesRepo],
  exports: [ChannelCategoriesService],
})
export class ChannelCategoriesModule {}
