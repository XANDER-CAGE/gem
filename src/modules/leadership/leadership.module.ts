import { Module } from '@nestjs/common';
import { StudentProfilesModule } from '../student-profiles/student-profiles.module';
import { TransactionModule } from '../transaction/transaction.module';
import { LeadershipController } from './leadership.controller';
import { LeadershipService } from './leadership.service';
import { LeadershipRepo } from './repo/leadership.repo';

@Module({
  imports: [StudentProfilesModule, TransactionModule,],
  controllers: [LeadershipController],
  providers: [LeadershipService, LeadershipRepo],
  exports: [LeadershipService],
})
export class LeadershipModule { }
