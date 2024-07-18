import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LevelService } from './level.service';
import { CreateLevelDto, UpdateLevelDto } from './dto/level.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags("Level")
@Controller('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @ApiOperation({ summary: 'Create new one' })
  @Post('/create')
  @ApiBody({ type: CreateLevelDto })
  @ApiOkResponse({ type: CoreApiResponse })
  create(@Body() createMarketDto: CreateLevelDto): any {
    const data = this.levelService.create(createMarketDto);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiOkResponse({ type: CoreApiResponse })
  findAll(@Query() dto: PaginationDto) {
    return this.levelService.findAll(dto);
  }

  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiOkResponse({ type: CoreApiResponse })
  findOne(@Param('id') id: string) {
    return this.levelService.findOne(id);
  }

  @ApiOperation({ summary: 'Update one' })
  @Patch(':id')
  @ApiBody({ type: UpdateLevelDto })
  @ApiOkResponse({ type: CoreApiResponse })
  update(@Param('id') id: string, @Body() updateMarketDto: UpdateLevelDto) {
    return this.levelService.update(id, updateMarketDto);
  }

  @ApiOperation({ summary: 'Delete one' })
  @Delete(':id')
  @ApiOkResponse({ type: CoreApiResponse })
  remove(@Param('id') id: string) {
    return this.levelService.remove(id);
  }
}
