import { PartialType } from '@nestjs/swagger';
import { CreateVacanciesAdmissionDto } from './create-vacancies-admission.dto';

export class UpdateVacanciesAdmissionDto extends PartialType(CreateVacanciesAdmissionDto) {}
