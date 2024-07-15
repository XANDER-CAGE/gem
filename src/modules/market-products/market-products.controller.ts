import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MarketProductsService } from './market-products.service';
import { CreateMarketProductDto } from './dto/market-products.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags("Market-Products")
@Controller('market-products')
export class MarketProductsController {
  constructor(private readonly marketProductsService: MarketProductsService) {}

  @Post()
  create(@Body() createMarketProductDto: CreateMarketProductDto) {
    return this.marketProductsService.create(createMarketProductDto);
  }

  @Get()
  findAll() {
    return this.marketProductsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketProductsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarketProductDto: CreateMarketProductDto) {
    return this.marketProductsService.update(id, updateMarketProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketProductsService.remove(id);
  }
}
