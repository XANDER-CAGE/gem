import { Injectable } from '@nestjs/common';
import { CreateMarketCategoryDto } from './dto/create-market-category.dto';
import { UpdateMarketCategoryDto } from './dto/update-market-category.dto';

@Injectable()
export class MarketCategoriesService {
  create(createMarketCategoryDto: CreateMarketCategoryDto) {
    return 'This action adds a new marketCategory';
  }

  findAll() {
    return `This action returns all marketCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} marketCategory`;
  }

  update(id: number, updateMarketCategoryDto: UpdateMarketCategoryDto) {
    return `This action updates a #${id} marketCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} marketCategory`;
  }
}
