import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MarketRepo } from './repo/market.repo';
import { ICreateMarket, IUpdateMarket } from './interface/market.interface';
import { MarketCategoriesRepo } from '../market-categories/repo/market-categories.repo';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class MarketService {
  @Inject() private readonly marketRepo: MarketRepo;
  @Inject() private readonly marketCategoryRepo:MarketCategoriesRepo;

  create(createMarketDto: ICreateMarket) {
    const { category_id } = createMarketDto;
    if (category_id) {
      const exist = this.marketCategoryRepo.findOne(category_id);
      if (!exist) {
        throw new NotFoundException('This category_id does not exist');
      }
    }
    return this.marketRepo.create(createMarketDto);
  }

  findAll(findAllMarketsDto:PaginationDto) {
    return this.marketRepo.findAll(findAllMarketsDto);
  }

  findOne(id: string) {
    return this.marketRepo.findOne(id);
  }

  update(id: string, updateMarketDto: IUpdateMarket) {
    const { category_id } = updateMarketDto;
    if (category_id) {
      const exist = this.marketCategoryRepo.findOne(category_id);
      if (!exist) {
        throw new NotFoundException('This category_id does not exist');
      }
    }
    return this.marketRepo.update(id, updateMarketDto);
  }

  remove(id: string) {
    return this.marketRepo.deleteOne(id)
  }
}
