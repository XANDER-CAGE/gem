import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICreateLevel, IUpdateLevel } from './entity/level.intefrace';
import { BadgeService } from '../badge/badge.service';
import { LevelRepo } from './repo/level.repo';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class LevelService {
  @Inject() private readonly badgeService: BadgeService;
  @Inject() private readonly levelRepo: LevelRepo;

  async create(createLevelDto: ICreateLevel) {
    const { badge_id } = createLevelDto;
    if (badge_id) {
      const exist = await this.badgeService.findOne(badge_id);
      if (!exist) {
        throw new NotFoundException('This badge id does not exist');
      }
    }
    return await this.levelRepo.create(createLevelDto);
  }

  async findAll(findAllLevelDto: PaginationDto) {
    return await this.levelRepo.findAll(findAllLevelDto);
  }

  async findOne(id: string) {
    return await this.levelRepo.findOne(id);
  }

  async update(id: string, updateLevelDto: IUpdateLevel) {
    const { badge_id } = updateLevelDto;
    if (badge_id) {
      const exist = await this.badgeService.findOne(badge_id);
      if (!exist) {
        throw new NotFoundException('This badge does not exist');
      }
    }
    return await this.levelRepo.update(id, updateLevelDto);
  }

  async remove(id: string) {
    return await this.levelRepo.deleteOne(id);
  }
}
