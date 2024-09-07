import { Injectable } from '@nestjs/common';
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
    private readonly levelRepo: LevelRepo,
    private readonly productService: ProductsService,
    @InjectConnection() private readonly knex: Knex,
  ) {}

  async create(createLevelDto: CreateLevelDto) {
    return await this.levelRepo.create(createLevelDto);
  }

  async findAll(findAllLevelDto: PaginationDto) {
    return await this.levelRepo.findAll(findAllLevelDto);
  }

  async findOne(id: string) {
    return await this.levelRepo.findOne(id);
  }

  async update(id: string, updateLevelDto: UpdateLevelDto) {
    return await this.levelRepo.update(id, updateLevelDto);
  }

  async remove() {
    return await this.levelRepo.deleteOne();
  }

  async connectReachedLevels(
    profileId: string,
    totalEarned: number,
    knex = this.knex,
  ): Promise<LevelEntity[]> {
    let totalGem = 0;
    const levels = await this.levelRepo.getUnreachedLevels(
      profileId,
      totalEarned,
      knex,
    );
    for (const level of levels) {
      await this.levelRepo.connectToProfile(profileId, level.id, knex);
      for (const product of level.products) {
        await this.productService.connectToProfile(profileId, product.id, knex);
      }
      totalGem += level.free_gem;
    }
    if (totalGem == 0) return levels;
    const checkForNewLevel = await this.connectReachedLevels(
      profileId,
      totalEarned + totalGem,
      knex,
    );
    return [...levels, ...checkForNewLevel];
  }
}
