import { Module } from '@nestjs/common';
import { LeadershipService } from './leadership.service';
import { LeadershipController } from './leadership.controller';
import { StudentProfilesModule } from '../student-profiles/student-profiles.module';
import { LeadershipRepo } from './repo/leadership.repo';

@Module({
  imports: [StudentProfilesModule],
  controllers: [LeadershipController],
  providers: [LeadershipService, LeadershipRepo],
})
export class LeadershipModule {}
