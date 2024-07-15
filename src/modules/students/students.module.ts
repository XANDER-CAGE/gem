import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { StudentsRepo } from './repo/students.repo';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService, StudentsRepo],
  exports: [StudentsRepo]
})
export class StudentsModule {}
