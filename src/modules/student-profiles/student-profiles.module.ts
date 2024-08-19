import { Module } from '@nestjs/common';
import { StudentProfilesService } from './student-profiles.service';
import { StudentProfilesController } from './student-profiles.controller';
import { StudentProfilesRepo } from './repo/student-profiles.repo';
import { LevelModule } from '../level/level.module';

@Module({
  imports: [LevelModule],
  controllers: [StudentProfilesController],
  providers: [StudentProfilesService, StudentProfilesRepo],
  exports: [StudentProfilesService, StudentProfilesRepo],
})
export class StudentProfilesModule {}
