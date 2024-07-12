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
import {
  CreateChannelDto,
  FindAllChannelDto,
  UpdateChannelDto,
} from './dto/channel.dto';
import { CoreApiResponse } from 'src/common/util/core-api-response.util';

@ApiTags('Channel')
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  async create(@Body() createChannelDto: CreateChannelDto) {
    const data = await this.channelService.create(createChannelDto);
    return CoreApiResponse.success(data);
  }

  @Get()
  async findAll(@Query() dto: FindAllChannelDto) {
    const { total, data } = await this.channelService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(+id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelService.remove(+id);
  }
}
