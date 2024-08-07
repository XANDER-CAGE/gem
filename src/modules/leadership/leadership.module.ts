import { Module } from '@nestjs/common';
import { LeadershipService } from './leadership.service';
import { LeadershipController } from './leadership.controller';
import { StudentProfilesModule } from '../student-profiles/student-profiles.module';
import { LeadershipRepo } from './repo/leadership.repo';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [StudentProfilesModule, TransactionModule],
  controllers: [LeadershipController],
  providers: [LeadershipService, LeadershipRepo],
})
export class LeadershipModule {}
