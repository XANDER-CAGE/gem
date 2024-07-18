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
import { MarketCategoriesService } from './market-categories.service';
import {
  CreateMarketCategoryDto,
  UpdateMarketCategoryDto,
} from './dto/market-categories.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('Market-Categories')
@Controller('market-categories')
export class MarketCategoriesController {
  constructor(
    private readonly marketCategoryService: MarketCategoriesService,
  ) {}

  @ApiOperation({ summary: 'Create new market' })
  @Post('/create')
  @ApiBody({ type: CreateMarketCategoryDto })
  @ApiOkResponse({ type: CoreApiResponse })
  async create(
    @Body() createMarketCategoriesDto: CreateMarketCategoryDto,
  ): Promise<any> {
    const data = await this.marketCategoryService.create(
      createMarketCategoriesDto,
    );
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiOkResponse({ type: CoreApiResponse })
  async findAll(@Query() dto: PaginationDto) {
    const { total, data } = await this.marketCategoryService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiOkResponse({ type: CoreApiResponse })
  async findOne(@Param('id') id: string) {
    const data = await this.marketCategoryService.findOne(id);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Update one' })
  @Patch(':id')
  @ApiBody({ type: UpdateMarketCategoryDto })
  @ApiOkResponse({ type: CoreApiResponse })
  async update(
    @Param('id') id: string,
    @Body() updateMarketCategoriesDto: UpdateMarketCategoryDto,
  ) {
    const data = await this.marketCategoryService.update(
      id,
      updateMarketCategoriesDto,
    );
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Delete one' })
  @Delete(':id')
  @ApiOkResponse({ type: CoreApiResponse })
  async remove(@Param('id') id: string) {
    await this.marketCategoryService.remove(id);
    return CoreApiResponse.success(null);
  }
}
