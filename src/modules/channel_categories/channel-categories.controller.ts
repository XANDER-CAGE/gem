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
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { IdDto } from 'src/common/dto/id.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ErrorApiResponse } from 'src/common/response-class/error.response';
import { DeleteApiResponse } from 'src/common/response-class/all-null.response';
import { CreateChannelCategoriesDto } from './dto/channel-categories-create.dto';
import { UpdateChannelCategoriesDto } from './dto/channel-categories-update.dto';
import { ChannelCategoriesService } from './channel-categories.service';
import { ListChannelCategoriesResponse } from './responce/list-channel-categories.responce';
import { CreateChannelCategoriesResponse } from './responce/create-channel-categories.responce';

@ApiTags('Channel-Categories')
@Controller('channel-categories')
export class ChannelCategoriesController {
  constructor(
    private readonly channelCategoriesService: ChannelCategoriesService,
  ) {}

  @ApiOperation({ summary: 'Create new one' })
  @Post('/create')
  @ApiBody({ type: CreateChannelCategoriesDto })
  @ApiOkResponse({ type: CreateChannelCategoriesResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async create(@Body() dto: CreateChannelCategoriesDto) {
    const data = await this.channelCategoriesService.create(dto);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiOkResponse({ type: ListChannelCategoriesResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findAll(@Query() dto: PaginationDto) {
    const { total, data } = await this.channelCategoriesService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiOkResponse({ type: CreateChannelCategoriesResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findOne(@Param() { id }: IdDto) {
    const data = await this.channelCategoriesService.findOne(id);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Update one' })
  @Patch(':id')
  @ApiBody({ type: UpdateChannelCategoriesDto })
  @ApiOkResponse({ type: CreateChannelCategoriesResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async update(
    @Param() { id }: IdDto,
    @Body() dto: UpdateChannelCategoriesDto,
  ) {
    const data = await this.channelCategoriesService.update(id, dto);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Delete one' })
  @Delete(':id')
  @ApiOkResponse({ type: DeleteApiResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async remove(@Param() { id }: IdDto) {
    await this.channelCategoriesService.remove(id);
    return CoreApiResponse.success(null);
  }
}
