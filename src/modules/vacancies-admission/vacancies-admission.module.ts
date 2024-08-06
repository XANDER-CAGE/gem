import { Module } from '@nestjs/common';
import { VacanciesAdmissionService } from './vacancies-admission.service';
import { VacanciesAdmissionController } from './vacancies-admission.controller';

@Module({
  controllers: [VacanciesAdmissionController],
  providers: [VacanciesAdmissionService],
})
export class VacanciesAdmissionModule {}
