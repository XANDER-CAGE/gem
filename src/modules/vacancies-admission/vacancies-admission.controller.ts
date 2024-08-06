import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VacanciesAdmissionService } from './vacancies-admission.service';
import { CreateVacanciesAdmissionDto } from './dto/create-vacancies-admission.dto';
import { UpdateVacanciesAdmissionDto } from './dto/update-vacancies-admission.dto';

@Controller('vacancies-admission')
export class VacanciesAdmissionController {
  constructor(private readonly vacanciesAdmissionService: VacanciesAdmissionService) {}

  @Post()
  create(@Body() createVacanciesAdmissionDto: CreateVacanciesAdmissionDto) {
    return this.vacanciesAdmissionService.create(createVacanciesAdmissionDto);
  }

  @Get()
  findAll() {
    return this.vacanciesAdmissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vacanciesAdmissionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVacanciesAdmissionDto: UpdateVacanciesAdmissionDto) {
    return this.vacanciesAdmissionService.update(id, updateVacanciesAdmissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vacanciesAdmissionService.remove(id);
  }
}
