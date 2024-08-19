import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { StudentProfilesRepo } from './repo/student-profiles.repo';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { IFindAllStudentProfile } from './interface/student-profile.interface';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';
import { StudentProfileEntity } from './entity/student-profile.entity';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';

@Injectable()
export class StudentProfilesService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly studentProfileRepo: StudentProfilesRepo,
  ) {}

  async create(createStudentProfile: CreateStudentProfileDto) {
    return this.studentProfileRepo.create(createStudentProfile);
  }

  async findAll(
    findAllStudentProfiles: PaginationDto,
  ): Promise<IFindAllStudentProfile> {
    return await this.studentProfileRepo.findAll(findAllStudentProfiles);
  }
  // async findTopList(limit: number, profile_id:string) {
  //   return await this.studentProfileRepo.findTopList(limit, profile_id);
  // }


  async findOne(id: string): Promise<StudentProfileEntity> {
    return await this.studentProfileRepo.findOne(id);
  }

  async update(
    id: string,
    updateStudentProfileDto: UpdateStudentProfileDto,
    knex = this.knex,
  ): Promise<StudentProfileEntity> {
    return this.studentProfileRepo.update(id, updateStudentProfileDto, knex);
  }

  async remove(id: string) {
    return await this.studentProfileRepo.deleteOne(id);
  }
}
