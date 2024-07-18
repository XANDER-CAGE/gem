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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { ErrorApiResponse } from 'src/common/response-class/errror.response';
import { CreateMarketResponse } from './response/create-market.response';
import { ListMarketRes } from './response/list-market.response';
import { DeleteApiResponse } from 'src/common/response-class/all-null.response';

@ApiTags('Market')
@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @ApiOperation({ summary: 'Create new market' })
  @Post('/create')
  @ApiBody({ type: CreateMarketDto })
  @ApiResponse({ type: ErrorApiResponse, status: 500 })
  @ApiResponse({ type: CreateMarketResponse, status: 201 })
  async create(@Body() createMarketDto: CreateMarketDto) {
    const data = await this.marketService.create(createMarketDto);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiResponse({ type: ErrorApiResponse, status: 500 })
  @ApiResponse({ type: ListMarketRes, status: 200 })
  findAll(@Query() dto: PaginationDto) {
    return this.marketService.findAll(dto);
  }

  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiResponse({ type: ErrorApiResponse, status: 500 })
  @ApiResponse({ type: CreateMarketResponse, status: 200 })
  findOne(@Param('id') id: string) {
    return this.marketService.findOne(id);
  }

  @ApiOperation({ summary: 'Update one' })
  @Patch(':id')
  @ApiBody({ type: UpdateMarketDto })
  @ApiResponse({ type: ErrorApiResponse, status: 500 })
  @ApiResponse({ type: CreateMarketResponse, status: 200 })
  update(@Param('id') id: string, @Body() updateMarketDto: UpdateMarketDto) {
    return this.marketService.update(id, updateMarketDto);
  }

  @ApiOperation({ summary: 'Delete one' })
  @Delete(':id')
  @ApiResponse({ type: ErrorApiResponse, status: 500 })
  @ApiResponse({ type: DeleteApiResponse, status: 200 })
  remove(@Param('id') id: string) {
    return this.marketService.remove(id);
  }
}
