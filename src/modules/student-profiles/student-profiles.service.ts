import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { StudentProfilesRepo } from './repo/student-profiles.repo';
import { LevelService } from '../level/level.service';
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
    private readonly levelService: LevelService,
  ) {}

  async create(createStudentProfile: CreateStudentProfileDto) {
    const { level_id } = createStudentProfile;
    const level = await this.levelService.findOne(level_id);
    if (!level) throw new NotFoundException('Level does not exist');
    return this.studentProfileRepo.create(createStudentProfile);
  }

  async findAll(
    findAllStudentProfiles: PaginationDto,
  ): Promise<IFindAllStudentProfile> {
    return await this.studentProfileRepo.findAll(findAllStudentProfiles);
  }
  async findTopList(limit: number) {
    return await this.studentProfileRepo.findTopList(limit);
  }

  async findOne(id: string): Promise<StudentProfileEntity> {
    return await this.studentProfileRepo.findOne(id);
  }

  async update(
    id: string,
    updateMarketDto: UpdateStudentProfileDto,
    knex = this.knex,
  ): Promise<StudentProfileEntity> {
    const { level_id } = updateMarketDto;
    if (level_id) {
      const level = await this.levelService.findOne(level_id);
      if (!level) throw new NotFoundException('Level does not exist');
    }
    return this.studentProfileRepo.update(id, updateMarketDto, knex);
  }

  async remove(id: string) {
    return await this.studentProfileRepo.deleteOne(id);
  }
}
