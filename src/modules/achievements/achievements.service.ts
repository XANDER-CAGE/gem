import { Injectable } from '@nestjs/common';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { AchievementsRepo } from './repo/achievements.repo';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class AchievementsService {
  constructor(private readonly achievementRepo: AchievementsRepo) {}
  async create(dto: CreateAchievementDto) {
    return await this.achievementRepo.create(dto);
  }

  async findAll(dto: PaginationDto) {
    return await this.achievementRepo.findAll(dto);
  }

  async findOne(id: string) {
    return await this.achievementRepo.findOne(id);
  }

  async update(id: string, dto: UpdateAchievementDto) {
    return await this.achievementRepo.update(id, dto);
  }

  async remove(id: string) {
    return await this.achievementRepo.deleteOne(id);
  }
}
