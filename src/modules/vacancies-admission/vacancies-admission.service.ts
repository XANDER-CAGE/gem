import { Injectable } from '@nestjs/common';
import { CreateVacanciesAdmissionDto } from './dto/create-vacancies-admission.dto';
import { UpdateVacanciesAdmissionDto } from './dto/update-vacancies-admission.dto';

@Injectable()
export class VacanciesAdmissionService {
  create(createVacanciesAdmissionDto: CreateVacanciesAdmissionDto) {
    return 'This action adds a new vacanciesAdmission';
  }

  findAll() {
    return `This action returns all vacanciesAdmission`;
  }

  findOne(id: string) {
    return `This action returns a #${id} vacanciesAdmission`;
  }

  update(id: string, updateVacanciesAdmissionDto: UpdateVacanciesAdmissionDto) {
    return `This action updates a #${id} vacanciesAdmission`;
  }

  remove(id: string) {
    return `This action removes a #${id} vacanciesAdmission`;
  }
}
