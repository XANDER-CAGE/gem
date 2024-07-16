import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ICreateStudentProfile,
  IFindAllStudentProfile,
  IUpdateStudentProfile,
} from './interface/student-profile.intefrace';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { StudentProfilesRepo } from './repo/student-profiles.repo';
import { StreaksService } from '../streaks/streaks.service';
import { LevelService } from '../level/level.service';

@Injectable()
export class StudentProfilesService {
  @Inject() private readonly studentProfileService: StudentProfilesRepo;
  @Inject() private readonly streakService: StreaksService;
  @Inject() private readonly levelService: LevelService;
  //Also i need to add StudentService

  async create(createStudentProfile: ICreateStudentProfile) {
    const { streak_id, level_id } = createStudentProfile;

    if (streak_id) {
      const streak = await this.streakService.findOne(streak_id);
      if (!streak) throw new NotFoundException('Streak does not exist');
    }
    const level = await this.levelService.findOne(level_id);
    if (!level) throw new NotFoundException('Level does not exist');
    return this.studentProfileService.create(createStudentProfile);
  }

  async findAll(
    findAllStudentProfiles: PaginationDto,
  ): Promise<IFindAllStudentProfile> {
    return await this.studentProfileService.findAll(findAllStudentProfiles);
  }

  async findOne(id: string) {
    return await this.studentProfileService.findOne(id);
  }

  async update(id: string, updateMarketDto: IUpdateStudentProfile) {
    const { streak_id, level_id } = updateMarketDto;

    if (streak_id) {
      const streak = await this.streakService.findOne(streak_id);
      if (!streak) throw new NotFoundException('Streak does not exist');
    }
    const level = await this.levelService.findOne(level_id);
    if (!level) throw new NotFoundException('Level does not exist');
    return this.studentProfileService.update(id, updateMarketDto);
  }

  async remove(id: string) {
    return await this.studentProfileService.deleteOne(id);
  }
}
