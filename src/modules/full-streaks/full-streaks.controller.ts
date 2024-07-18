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
import { FullStreaksService } from './full-streaks.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { CreateFullStreakDto, UpdateFullStreakDto } from './dto/full-streaks.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('Full-Streak')
@Controller('full-streaks')
export class FullStreaksController {
  constructor(private readonly fullStreakService: FullStreaksService) {}

  @ApiOperation({ summary: 'Create new one' })
  @Post('/create')
  @ApiBody({ type: CreateFullStreakDto })
  @ApiOkResponse({ type: CoreApiResponse })
  async create(@Body() createFullStreak: CreateFullStreakDto) {
    const data = await this.fullStreakService.create(createFullStreak);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiOkResponse({ type: CoreApiResponse })
  async findAll(@Query() dto: PaginationDto) {
    const { total, data } = await this.fullStreakService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiOkResponse({ type: CoreApiResponse })
  async findOne(@Param('id') id: string) {
    const data = await this.fullStreakService.findOne(id);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Update one' })
  @Patch(':id')
  @ApiBody({ type: UpdateFullStreakDto })
  @ApiOkResponse({ type: CoreApiResponse })
  async update(
    @Param('id') id: string,
    @Body() updateMarketDto: UpdateFullStreakDto,
  ) {
    const data = await this.fullStreakService.update(id, updateMarketDto);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Delete one' })
  @Delete(':id')
  @ApiOkResponse({ type: CoreApiResponse })
  async remove(@Param('id') id: string) {
    await this.fullStreakService.remove(id);
    return CoreApiResponse.success(null);
  }
}
