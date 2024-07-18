import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto/market-products.dto';
import { ApiTags } from '@nestjs/swagger';
import { ProductsService } from './market-products.service';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IdDto } from 'src/common/dto/id.dto';

@ApiTags('Market-Products')
@Controller('market-products')
export class MarketProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() dto: CreateProductDto) {
    const data = await this.productsService.create(dto);
    return CoreApiResponse.success(data);
  }

  @Get()
  async findAll(@Query() dto: PaginationDto) {
    const { total, data } = await this.productsService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @Get(':id')
  async findOne(@Param() { id }: IdDto) {
    const data = await this.productsService.findOne(id);
    return CoreApiResponse.success(data);
  }

  @Patch(':id')
  async update(@Param() { id }: IdDto, @Body() dto: UpdateProductDto) {
    const data = await this.productsService.update(id, dto);
    return CoreApiResponse.success(data);
  }

  @Delete(':id')
  async remove(@Param() { id }: IdDto) {
    await this.productsService.remove(id);
    return CoreApiResponse.success(null);
  }
}
