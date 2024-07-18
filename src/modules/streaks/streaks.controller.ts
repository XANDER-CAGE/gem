import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { CreateStreakDto, UpdateStreakDto } from './dto/streaks.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationDto } from 'src/common/dto/pagination.dto';


@ApiTags('Streaks')
@Controller('streaks')
export class StreaksController {
  constructor(private readonly streaksService: StreaksService) {}

  @ApiOperation({ summary: 'Create new one' })
  @Post('/create')
  @ApiBody({ type: CreateStreakDto })
  @ApiOkResponse({ type: CoreApiResponse })
  create(@Body() createStreak: CreateStreakDto): any {
    const data = this.streaksService.create(createStreak);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiOkResponse({ type: CoreApiResponse })
  findAll(@Query() dto: PaginationDto) {
    return this.streaksService.findAll(dto);
  }

  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiOkResponse({ type: CoreApiResponse })
  findOne(@Param('id') id: string) {
    return this.streaksService.findOne(id);
  }

  @ApiOperation({ summary: 'Update one' })
  @Patch(':id')
  @ApiBody({ type: UpdateStreakDto })
  @ApiOkResponse({ type: CoreApiResponse })
  update(
    @Param('id') id: string,
    @Body() updateStreak: UpdateStreakDto,
  ) {
    return this.streaksService.update(id, updateStreak);
  }

  @ApiOperation({ summary: 'Delete one' })
  @Delete(':id')
  @ApiOkResponse({ type: CoreApiResponse })
  remove(@Param('id') id: string) {
    return this.streaksService.remove(id);
  }
}
