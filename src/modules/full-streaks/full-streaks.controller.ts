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
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateFullStreakDto } from './dto/create-full-streaks.dto';
import { UpdateFullStreakDto } from './dto/update-full-streaks.dto';
import { CreateFullStreakResponse } from './response/create-full-streaks.response';
import { ErrorApiResponse } from 'src/common/response-class/error.response';
import { ListFullStreakResponse } from './response/list-full-streaks.response';
import { DeleteApiResponse } from 'src/common/response-class/all-null.response';

@ApiTags('Full-Streak')
@Controller('full-streaks')
export class FullStreaksController {
  constructor(private readonly fullStreakService: FullStreaksService) {}

  @ApiOperation({ summary: 'Create new one' })
  @Post('/create')
  @ApiBody({ type: CreateFullStreakDto })
  @ApiOkResponse({ type: CreateFullStreakResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async create(@Body() createFullStreak: CreateFullStreakDto) {
    const data = await this.fullStreakService.create(createFullStreak);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiOkResponse({ type: ListFullStreakResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findAll(@Query() dto: PaginationDto) {
    const { total, data } = await this.fullStreakService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiOkResponse({ type: CreateFullStreakResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findOne(@Param('id') id: string) {
    const data = await this.fullStreakService.findOne(id);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Update one' })
  @Patch(':id')
  @ApiBody({ type: UpdateFullStreakDto })
  @ApiOkResponse({ type: CreateFullStreakResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async update(
    @Param('id') id: string,
    @Body() updateMarketDto: UpdateFullStreakDto,
  ) {
    const data = await this.fullStreakService.update(id, updateMarketDto);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Delete one' })
  @Delete(':id')
  @ApiOkResponse({ type: DeleteApiResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async remove(@Param('id') id: string) {
    await this.fullStreakService.remove(id);
    return CoreApiResponse.success(null);
  }
}
