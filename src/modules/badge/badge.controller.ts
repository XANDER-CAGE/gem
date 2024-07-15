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
import { BadgeService } from './badge.service';
import { CreateBadgeDto, UpdateBadgeDto } from './dto/badge.dto';
import { CoreApiResponse } from 'src/common/util/core-api-response.util';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IdDto } from 'src/common/dto/id.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Badge')
@Controller('badge')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Post()
  async create(@Body() dto: CreateBadgeDto) {
    const data = await this.badgeService.create(dto);
    return CoreApiResponse.success(data);
  }

  @Get()
  async findAll(@Query() dto: PaginationDto) {
    const { total, data } = await this.badgeService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @Get(':id')
  async findOne(@Param() { id }: IdDto) {
    const data = await this.badgeService.findOne(id);
    return CoreApiResponse.success(data);
  }

  @Patch(':id')
  async update(@Param() { id }: IdDto, @Body() dto: UpdateBadgeDto) {
    const data = await this.badgeService.update(id, dto);
    return CoreApiResponse.success(data);
  }

  @Delete(':id')
  async remove(@Param() { id }: IdDto) {
    await this.badgeService.remove(id);
    return CoreApiResponse.success(null);
  }
}
