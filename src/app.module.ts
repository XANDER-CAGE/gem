import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChannelModule } from './modules/channel/channel.module';

@Module({
  imports: [ConfigModule.forRoot(), ChannelModule],
})
export class AppModule {}
