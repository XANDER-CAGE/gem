import { Inject, Injectable } from '@nestjs/common';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MarketCategoriesRepo } from './repo/market-categories.repo';
import {
  ICreateMarketCategory,
  IFindAllCategoriesMarkets,
  IUpdateMarketCategory,
} from './entity/market-categories.interface';

@Injectable()
export class MarketCategoriesService {
  @Inject() private readonly marketCategoryRepo: MarketCategoriesRepo;

  create(createMarketDto: ICreateMarketCategory) {
    return this.marketCategoryRepo.create(createMarketDto);
  }

  async findAll(
    findAllMarketCategoriesDto: PaginationDto,
  ): Promise<IFindAllCategoriesMarkets> {
    return await this.marketCategoryRepo.findAll(findAllMarketCategoriesDto);
  }

  findOne(id: string) {
    return this.marketCategoryRepo.findOne(id);
  }

  update(id: string, updateMarketDto: IUpdateMarketCategory) {
    return this.marketCategoryRepo.update(id, updateMarketDto);
  }

  remove(id: string) {
    return this.marketCategoryRepo.deleteOne(id);
  }
}
