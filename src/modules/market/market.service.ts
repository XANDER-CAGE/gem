import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MarketRepo } from './repo/market.repo';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MarketCategoriesService } from '../market-categories/market-categories.service';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';

@Injectable()
export class MarketService {
  @Inject() private readonly marketRepo: MarketRepo;
  @Inject() private readonly categoryService: MarketCategoriesService;

  async create(createMarketDto: CreateMarketDto) {
    const { category_id } = createMarketDto;
    if (category_id) {
      const exist = await this.categoryService.findOne(category_id);
      if (!exist) {
        throw new NotFoundException('This category_id does not exist');
      }
    }
    return await this.marketRepo.create(createMarketDto);
  }

  async findAll(findAllMarketsDto: PaginationDto) {
    return await this.marketRepo.findAll(findAllMarketsDto);
  }

  async findOne(id: string) {
    return await this.marketRepo.findOne(id);
  }

  async update(id: string, updateMarketDto: UpdateMarketDto) {
    const { category_id } = updateMarketDto;
    if (category_id) {
      const exist = await this.categoryService.findOne(category_id);
      if (!exist) {
        throw new NotFoundException('This category_id does not exist');
      }
    }
    return await this.marketRepo.update(id, updateMarketDto);
  }

  async remove(id: string) {
    return await this.marketRepo.deleteOne(id);
  }
}
