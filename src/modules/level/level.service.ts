import { Injectable, NotFoundException } from '@nestjs/common';
import { BadgeService } from '../badge/badge.service';
import { LevelRepo } from './repo/level.repo';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { ProductsService } from '../market-products/market-products.service';
import { LevelEntity } from './entity/level.entity';

@Injectable()
export class LevelService {
  constructor(
    private readonly badgeService: BadgeService,
    private readonly levelRepo: LevelRepo,
    private readonly productService: ProductsService,
    @InjectConnection() private readonly knex: Knex,
  ) {}

  async create(createLevelDto: CreateLevelDto) {
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

  async update(id: string, updateLevelDto: UpdateLevelDto) {
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

  async connectToProfile(
    profileId: string,
    gems: number,
    knex = this.knex,
  ): Promise<LevelEntity[]> {
    let totalGem = 0;
    const levels = await this.levelRepo.getUnreachedLevels(
      profileId,
      gems,
      knex,
    );
    for (const level of levels) {
      await this.levelRepo.connectToProfile(profileId, level.id, knex);
      for (const product of level.products) {
        await this.productService.connectToProfile(profileId, product.id, knex);
      }
      if (level.badge_id) {
        await this.badgeService.connectToProfile(
          profileId,
          level.badge_id,
          knex,
        );
      }
      totalGem += level.free_gem;
    }
    return totalGem == 0
      ? levels
      : [
          ...levels,
          ...(await this.connectToProfile(profileId, gems + totalGem, knex)),
        ];
  }
}
