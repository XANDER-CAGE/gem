import { Module } from '@nestjs/common';
import { AssignService } from './assign.service';
import { AssignController } from './assign.controller';
import { StudentProfilesModule } from '../student-profiles/student-profiles.module';
import { ChannelModule } from '../channel/channel.module';
import { StreaksModule } from '../streaks/streaks.module';
import { TransactionModule } from '../transaction/transaction.module';
import { FullStreaksModule } from '../full-streaks/full-streaks.module';

@Module({
  imports: [
    StudentProfilesModule,
    ChannelModule,
    StreaksModule,
    TransactionModule,
    FullStreaksModule,
  ],
  controllers: [AssignController],
  providers: [AssignService],
})
export class AssignModule {}
