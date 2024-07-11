import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MarketCategoriesService } from './market-categories.service';
import { CreateMarketCategoryDto } from './dto/create-market-category.dto';
import { UpdateMarketCategoryDto } from './dto/update-market-category.dto';

@Controller('market-categories')
export class MarketCategoriesController {
  constructor(private readonly marketCategoriesService: MarketCategoriesService) {}

  @Post()
  create(@Body() createMarketCategoryDto: CreateMarketCategoryDto) {
    return this.marketCategoriesService.create(createMarketCategoryDto);
  }

  @Get()
  findAll() {
    return this.marketCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarketCategoryDto: UpdateMarketCategoryDto) {
    return this.marketCategoriesService.update(+id, updateMarketCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketCategoriesService.remove(+id);
  }
}
