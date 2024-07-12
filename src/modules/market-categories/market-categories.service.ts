import { Injectable } from '@nestjs/common';
import { CreateMarketCategoryDto, UpdateMarketCategoryDto } from './dto/market-categories.dto';


@Injectable()
export class MarketCategoriesService {
  create(createMarketCategoryDto: CreateMarketCategoryDto) {
    return 'This action adds a new marketCategory';
  }

  findAll() {
    return `This action returns all marketCategories`;
  }

  findOne(id: string) {
    return `This action returns a #${id} marketCategory`;
  }

  update(id: string, updateMarketCategoryDto: UpdateMarketCategoryDto) {
    return `This action updates a #${id} marketCategory`;
  }

  remove(id: string) {
    return `This action removes a #${id} marketCategory`;
  }
}
