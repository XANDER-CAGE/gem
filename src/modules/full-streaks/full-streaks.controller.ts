import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FullStreaksService } from './full-streaks.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/util/core-api-response.util';
import { CreateFullStreakDto, UpdateFullStreakDto } from './dto/full-streaks.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';


@ApiTags("Full-Streak")
@Controller('full-streaks')
export class FullStreaksController {
  constructor(private readonly fullStreakService: FullStreaksService) {}

  @ApiOperation({ summary: 'Create new one' })
  @Post('/create')
  @ApiBody({ type: CreateFullStreakDto })
  @ApiOkResponse({ type: CoreApiResponse })
  create(@Body() createFullStreak: CreateFullStreakDto) {
    const data = this.fullStreakService.create(createFullStreak);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiOkResponse({ type: CoreApiResponse })
  findAll(@Query() dto: PaginationDto) {
    return this.fullStreakService.findAll(dto);
  }

  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiOkResponse({ type: CoreApiResponse })
  findOne(@Param('id') id: string) {
    return this.fullStreakService.findOne(id);
  }

  @ApiOperation({ summary: 'Update one' })
  @Patch(':id')
  @ApiBody({ type: UpdateFullStreakDto })
  @ApiOkResponse({ type: CoreApiResponse })
  update(@Param('id') id: string, @Body() updateMarketDto: UpdateFullStreakDto) {
    return this.fullStreakService.update(id, updateMarketDto);
  }

  @ApiOperation({ summary: 'Delete one' })
  @Delete(':id')
  @ApiOkResponse({ type: CoreApiResponse })
  remove(@Param('id') id: string) {
    return this.fullStreakService.remove(id);
  }
}
