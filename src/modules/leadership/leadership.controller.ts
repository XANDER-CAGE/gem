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
import { LeadershipService } from './leadership.service';
import { CreateLeadershipDto } from './dto/create-leadership.dto';
import { UpdateLeadershipDto } from './dto/update-leadership.dto';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateLeadershipResponse } from './response/create-leadership.response';
import { ErrorApiResponse } from 'src/common/response-class/error.response';
import { ListLeadershipResponse } from './response/list-leadership.response';
import { DeleteApiResponse } from 'src/common/response-class/all-null.response';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('leadership')
export class LeadershipController {
  constructor(private readonly leadershipService: LeadershipService) {}

  @ApiOperation({ summary: 'Create new one' })
  @Post('/create')
  @ApiBody({ type: CreateLeadershipDto })
  @ApiOkResponse({ type: CreateLeadershipResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async create(@Body() createLeadershipDto: CreateLeadershipDto) {
    const data = await this.leadershipService.create(createLeadershipDto);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiOkResponse({ type: ListLeadershipResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findAll(@Query() dto: PaginationDto) {
    const { total, data } = await this.leadershipService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiOkResponse({ type: CreateLeadershipResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findOne(@Param('id') id: string) {
    const data = await this.leadershipService.findOne(id);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Update one' })
  @Patch(':id')
  @ApiBody({ type: UpdateLeadershipDto })
  @ApiOkResponse({ type: CreateLeadershipResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async update(
    @Param('id') id: string,
    @Body() updateLeadershipDto: UpdateLeadershipDto,
  ) {
    const data = await this.leadershipService.update(id, updateLeadershipDto);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Delete one' })
  @Delete(':id')
  @ApiOkResponse({ type: DeleteApiResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async remove(@Param('id') id: string) {
    await this.leadershipService.remove(id);
    return CoreApiResponse.success(null);
  }
}
