import { Inject, Injectable, NotFoundException, Query } from '@nestjs/common';
import {
  CreateMarketCategoryDto,
  UpdateMarketCategoryDto,
} from './dto/market-categories.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CoreApiResponse } from 'src/common/util/core-api-response.util';
import { MarketCategoriesRepo } from './repo/market-categories.repo';
import { ICreateMarketCategory, IFindAllCategoriesMarkets, IUpdateMarketCategory } from './interface/market-categories.interface';
import { IFindAllChannel } from '../channel/interface/channel.interface';

@Injectable()
export class MarketCategoriesService {
  @Inject() private readonly marketCategoryRepo: MarketCategoriesRepo;

  create(createMarketDto: ICreateMarketCategory) {
    return this.marketCategoryRepo.create(createMarketDto);
  }

  async findAll(findAllMarketCategoriesDto: PaginationDto): Promise<IFindAllCategoriesMarkets> {
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
