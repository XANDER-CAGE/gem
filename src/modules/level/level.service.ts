import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICreateLevel, IUpdateLevel } from './entity/level.intefrace';
import { BadgeService } from '../badge/badge.service';
import { LevelRepo } from './repo/level.repo';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class LevelService {
  @Inject() private readonly badgeService: BadgeService;
  @Inject() private readonly levelRepo: LevelRepo;

  create(createLevelDto: ICreateLevel) {
    const { badge_id } = createLevelDto;
    if (badge_id) {
      const exist = this.badgeService.findOne(badge_id);
      if (!exist) {
        throw new NotFoundException('This badge id does not exist');
      }
    }
    return this.levelRepo.create(createLevelDto);
  }

  findAll(findAllLevelDto: PaginationDto) {
    return this.levelRepo.findAll(findAllLevelDto);
  }

  findOne(id: string) {
    return this.levelRepo.findOne(id);
  }

  update(id: string, updateLevelDto: IUpdateLevel) {
    const { badge_id } = updateLevelDto;
    if (badge_id) {
      const exist = this.badgeService.findOne(badge_id);
      if (!exist) {
        throw new NotFoundException('This badge does not exist');
      }
    }
    return this.levelRepo.update(id, updateLevelDto);
  }

  remove(id: string) {
    return this.levelRepo.deleteOne(id);
  }
}
