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
import { ChannelService } from './channel.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { IdDto } from 'src/common/dto/id.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateChannelDto } from './dto/channel-create.dto';
import { UpdateChannelDto } from './dto/channel-update.dto';
import { CreateChannelResponse } from './responce/create-channel.responce';
import { ErrorApiResponse } from 'src/common/response-class/error.response';
import { DeleteApiResponse } from 'src/common/response-class/all-null.response';
import { ListChannelResponse } from './responce/list-channel.responce';

@ApiTags('Channel')
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @ApiOperation({ summary: 'Create new one' })
  @Post('/create')
  @ApiBody({ type: CreateChannelDto })
  @ApiOkResponse({ type: CreateChannelResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async create(@Body() dto: CreateChannelDto) {
    const data = await this.channelService.create(dto);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiOkResponse({ type: ListChannelResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findAll(@Query() dto: PaginationDto) {
    const { total, data } = await this.channelService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiOkResponse({ type: CreateChannelResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findOne(@Param() { id }: IdDto) {
    const data = await this.channelService.findOne(id);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Update one' })
  @Patch(':id')
  @ApiBody({ type: UpdateChannelDto })
  @ApiOkResponse({ type: CreateChannelResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async update(@Param() { id }: IdDto, @Body() dto: UpdateChannelDto) {
    const data = await this.channelService.update(id, dto);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Delete one' })
  @Delete(':id')
  @ApiOkResponse({ type: DeleteApiResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async remove(@Param() { channel_category_id }: CreateChannelDto) {
    await this.channelService.remove(channel_category_id);
    return CoreApiResponse.success(null);
  }
}
