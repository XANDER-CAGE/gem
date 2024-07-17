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
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  CoreApiResponse,
  ErrorApiResponse,
} from 'src/common/util/core-api-response.util';

@ApiTags('Market')
@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @ApiOperation({ summary: 'Create new market' })
  @Post('/create')
  @ApiBody({ type: CreateMarketDto })
  @ApiResponse({ type: ErrorApiResponse, status: 500 })
  @ApiResponse({})
  create(@Body() createMarketDto: CreateMarketDto) {
    const data = this.marketService.create(createMarketDto);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiOkResponse({ type: CoreApiResponse })
  findAll(@Query() dto: PaginationDto) {
    return this.marketService.findAll(dto);
  }

  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiOkResponse({ type: CoreApiResponse })
  findOne(@Param('id') id: string) {
    return this.marketService.findOne(id);
  }

  @ApiOperation({ summary: 'Update one' })
  @Patch(':id')
  @ApiBody({ type: UpdateMarketDto })
  @ApiOkResponse({ type: CoreApiResponse })
  update(@Param('id') id: string, @Body() updateMarketDto: UpdateMarketDto) {
    return this.marketService.update(id, updateMarketDto);
  }

  @ApiOperation({ summary: 'Delete one' })
  @Delete(':id')
  @ApiOkResponse({ type: CoreApiResponse })
  remove(@Param('id') id: string) {
    return this.marketService.remove(id);
  }
}
