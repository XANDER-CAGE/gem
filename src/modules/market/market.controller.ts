import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MarketService } from './market.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { ErrorApiResponse } from 'src/common/response-class/error.response';
import { CreateMarketResponse } from './response/create-market.response';
import { ListMarketResponse } from './response/list-market.response';
import { DeleteApiResponse } from 'src/common/response-class/all-null.response';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/common/decorator/roles.decorator';
import { FindAllMarketDto } from './dto/find-all.market.dto';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('Market')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.app_admin)
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

  @Public()
  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiResponse({ type: ErrorApiResponse, status: 500 })
  @ApiResponse({ type: ListMarketResponse, status: 200 })
  async findAll(@Query() dto: FindAllMarketDto) {
    const { total, data } = await this.marketService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @Public()
  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiResponse({ type: ErrorApiResponse, status: 500 })
  @ApiResponse({ type: CreateMarketResponse, status: 200 })
  async findOne(@Param('id') id: string) {
    const data = await this.marketService.findOne(id);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Update one' })
  @Patch(':id')
  @ApiBody({ type: UpdateMarketDto })
  @ApiResponse({ type: ErrorApiResponse, status: 500 })
  @ApiResponse({ type: CreateMarketResponse, status: 200 })
  async update(
    @Param('id') id: string,
    @Body() updateMarketDto: UpdateMarketDto,
  ) {
    const data = await this.marketService.update(id, updateMarketDto);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Delete one' })
  @Delete(':id')
  @ApiResponse({ type: ErrorApiResponse, status: 500 })
  @ApiResponse({ type: DeleteApiResponse, status: 200 })
  async remove(@Param('id') id: string) {
    const data = await this.marketService.remove(id);
    return CoreApiResponse.success(data);
  }
}
