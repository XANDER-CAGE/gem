import { Module } from '@nestjs/common';
import { AssignService } from './assign.service';
import { AssignController } from './assign.controller';
import { StudentProfilesModule } from '../student-profiles/student-profiles.module';
import { ChannelModule } from '../channel/channel.module';
import { StreaksModule } from '../streaks/streaks.module';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    StudentProfilesModule,
    ChannelModule,
    StreaksModule,
    TransactionModule,
  ],
  controllers: [AssignController],
  providers: [AssignService],
})
export class AssignModule {}
