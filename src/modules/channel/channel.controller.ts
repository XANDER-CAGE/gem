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
import { ApiTags } from '@nestjs/swagger';
import { CreateChannelDto, UpdateChannelDto } from './dto/channel.dto';
import { CoreApiResponse } from 'src/common/util/core-api-response.util';
import { IdDto } from 'src/common/dto/id.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('Channel')
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  async create(@Body() dto: CreateChannelDto) {
    const data = await this.channelService.create(dto);
    return CoreApiResponse.success(data);
  }

  @Get()
  async findAll(@Query() dto: PaginationDto) {
    const { total, data } = await this.channelService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @Get(':id')
  async findOne(@Param() { id }: IdDto) {
    const data = await this.channelService.findOne(id);
    return CoreApiResponse.success(data);
  }

  @Patch(':id')
  async update(@Param() { id }: IdDto, @Body() dto: UpdateChannelDto) {
    const data = await this.channelService.update(id, dto);
    return CoreApiResponse.success(data);
  }

  @Delete(':id')
  async remove(@Param() { id }: IdDto) {
    await this.channelService.remove(id);
    return CoreApiResponse.success(null);
  }
}
