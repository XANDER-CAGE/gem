import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { StudentProfilesRepo } from './repo/student-profiles.repo';
import { LevelService } from '../level/level.service';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { IFindAllStudentProfile } from './interface/student-profile.interface';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';

@Injectable()
export class StudentProfilesService {
  //Also i need to add StudentService
  constructor(
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

  async findOne(id: string) {
    return await this.studentProfileRepo.findOne(id);
  }

  async update(id: string, updateMarketDto: UpdateStudentProfileDto) {
    const { level_id } = updateMarketDto;
    const level = await this.levelService.findOne(level_id);
    if (!level) throw new NotFoundException('Level does not exist');
    return this.studentProfileRepo.update(id, updateMarketDto);
  }

  async remove(id: string) {
    return await this.studentProfileRepo.deleteOne(id);
  }
}
