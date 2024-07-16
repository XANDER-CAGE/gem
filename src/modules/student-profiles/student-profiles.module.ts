import { Module } from '@nestjs/common';
import { StudentProfilesService } from './student-profiles.service';
import { StudentProfilesController } from './student-profiles.controller';
import { StudentProfilesRepo } from './repo/student-profiles.repo';

@Module({
  controllers: [StudentProfilesController],
  providers: [StudentProfilesService, StudentProfilesRepo],
})
export class StudentProfilesModule {}
