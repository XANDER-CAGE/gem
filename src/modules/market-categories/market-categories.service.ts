import { Inject, Injectable } from '@nestjs/common';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MarketCategoriesRepo } from './repo/market-categories.repo';
import { CreateMarketCategoryDto } from './dto/create-market-categories.dto';
import { IFindAllCategoriesMarkets } from './interface/market-categories.interface';
import { UpdateMarketCategoryDto } from './dto/update-market-categories.dto';

@Injectable()
export class MarketCategoriesService {
  @Inject() private readonly marketCategoryRepo: MarketCategoriesRepo;

  create(createMarketDto: CreateMarketCategoryDto) {
    return this.marketCategoryRepo.create(createMarketDto);
  }

  async findAll(
    findAllMarketCategoriesDto: PaginationDto,
  ): Promise<IFindAllCategoriesMarkets> {
    return await this.marketCategoryRepo.findAll(findAllMarketCategoriesDto);
  }

  async findOne(id: string) {
    return this.marketCategoryRepo.findOne(id);
  }

  async update(id: string, updateMarketDto: UpdateMarketCategoryDto) {
    return await this.marketCategoryRepo.update(id, updateMarketDto);
  }

  async remove(id: string) {
    return await this.marketCategoryRepo.deleteOne(id);
  }
}
