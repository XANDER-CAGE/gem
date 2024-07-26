import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AssignChannelDto } from './dto/assign-channel.dto';
import { HomeService } from './home.service';
import { ErrorApiResponse } from 'src/common/response-class/error.response';
import { PaginationWithTopListDto } from 'src/common/dto/pagination.dto';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { ListOfLeadership } from './response/ListOfLeadership.response';

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
  @ApiOkResponse({ type: ListOfLeadership, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async listOfLeadership(@Query() dto: PaginationWithTopListDto) {
    const { total, data } = await this.assignService.listOfLeadership(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }
}
