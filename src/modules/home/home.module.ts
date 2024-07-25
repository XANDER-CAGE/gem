import { Module } from '@nestjs/common';
import { AssignController } from './home.controller';
import { StudentProfilesModule } from '../student-profiles/student-profiles.module';
import { ChannelModule } from '../channel/channel.module';
import { StreaksModule } from '../streaks/streaks.module';
import { TransactionModule } from '../transaction/transaction.module';
import { FullStreaksModule } from '../full-streaks/full-streaks.module';
import { HomeService } from './home.service';

@Module({
  imports: [
    StudentProfilesModule,
    ChannelModule,
    StreaksModule,
    TransactionModule,
    FullStreaksModule,
  ],
  controllers: [AssignController],
  providers: [HomeService],
})
export class HomeModule {}
