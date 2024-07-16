import { Module } from '@nestjs/common';
import { StudentProfilesService } from './student-profiles.service';
import { StudentProfilesController } from './student-profiles.controller';
import { StudentProfilesRepo } from './repo/student-profiles.repo';
import { LevelModule } from '../level/level.module';
import { StreaksModule } from '../streaks/streaks.module';

@Module({
  imports: [LevelModule, StreaksModule],
  controllers: [StudentProfilesController],
  providers: [StudentProfilesService, StudentProfilesRepo],
})
export class StudentProfilesModule {}
