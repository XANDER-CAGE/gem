import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AssignChannelDto } from './dto/assign-channel.dto';
import { HomeService } from './home.service';
import { ErrorApiResponse } from 'src/common/response-class/error.response';
import { LimitWithTopListDto } from './dto/home.dto';

@ApiTags('Home')
@Controller()
export class AssignController {
  constructor(private readonly assignService: HomeService) {}
  @Post('assign/channel')
  async assignChannel(@Body() dto: AssignChannelDto) {
    return await this.assignService.assignChannel(dto);
  }

  @ApiOperation({ summary: 'Top lists' })
  @Get('list-of-leadership')
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async listOfLeadership(@Query() dto: LimitWithTopListDto) {
    return await this.assignService.listOfLeadership(dto);
  }
}
