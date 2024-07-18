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
import { StreaksService } from './streaks.service';
import { CreateStreakDto, UpdateStreakDto } from './dto/streaks.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/util/core-api-response.util';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('Streaks')
@Controller('streaks')
export class StreaksController {
  constructor(private readonly streaksService: StreaksService) {}

  @ApiOperation({ summary: 'Create new one' })
  @Post('/create')
  @ApiBody({ type: CreateStreakDto })
  @ApiOkResponse({ type: CoreApiResponse })
  async create(@Body() createStreak: CreateStreakDto): Promise<any> {
    const data = await this.streaksService.create(createStreak);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiOkResponse({ type: CoreApiResponse })
  async findAll(@Query() dto: PaginationDto) {
    const { total, data } = await this.streaksService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiOkResponse({ type: CoreApiResponse })
  async findOne(@Param('id') id: string) {
    const data = await this.streaksService.findOne(id);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Update one' })
  @Patch(':id')
  @ApiBody({ type: UpdateStreakDto })
  @ApiOkResponse({ type: CoreApiResponse })
  async update(@Param('id') id: string, @Body() updateStreak: UpdateStreakDto) {
    const data = await this.streaksService.update(id, updateStreak);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Delete one' })
  @Delete(':id')
  @ApiOkResponse({ type: CoreApiResponse })
  async remove(@Param('id') id: string) {
    await this.streaksService.remove(id);
    return CoreApiResponse.success(null)
  }
}
