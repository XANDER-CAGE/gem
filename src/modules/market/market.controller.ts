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
import { MarketService } from './market.service';
import { CreateMarketDto, UpdateMarketDto } from './dto/market.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/util/core-api-response.util';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('Market')
@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @ApiOperation({ summary: 'Create new market' })
  @Post('/create')
  @ApiBody({ type: CreateMarketDto })
  @ApiOkResponse({ type: CoreApiResponse })
  async create(@Body() createMarketDto: CreateMarketDto) {
    const data = await this.marketService.create(createMarketDto);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiOkResponse({ type: CoreApiResponse })
  async indAll(@Query() dto: PaginationDto) {
    const { total, data } = await this.marketService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiOkResponse({ type: CoreApiResponse })
  async findOne(@Param('id') id: string) {
    const data = await this.marketService.findOne(id);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Update one' })
  @Patch(':id')
  @ApiBody({ type: UpdateMarketDto })
  @ApiOkResponse({ type: CoreApiResponse })
  async update(
    @Param('id') id: string,
    @Body() updateMarketDto: UpdateMarketDto,
  ) {
    const data = await this.marketService.update(id, updateMarketDto);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Delete one' })
  @Delete(':id')
  @ApiOkResponse({ type: CoreApiResponse })
  async remove(@Param('id') id: string) {
    await this.marketService.remove(id);
    return CoreApiResponse.success(null);
  }
}
