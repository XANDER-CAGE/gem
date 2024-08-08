import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LeadershipService } from './leadership.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ErrorApiResponse } from 'src/common/response-class/error.response';
import {
  LimitWithTopListBySchoolDto,
  LimitWithTopListDto,
} from './dto/create-leadership.dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/role.enum';

@ApiTags('Leadership')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.app_admin)
@Controller('leadership')
export class LeadershipController {
  constructor(private readonly leadershipService: LeadershipService) {}

  @ApiOperation({ summary: 'Save to the leadership' })
  @Get('save-leadership')
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async saveLeadership() {
    return await this.leadershipService.saveLeadership();
  }

  @ApiOperation({ summary: 'Top lists' })
  @Get('list-of-leadership')
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async listOfLeadership(@Query() dto: LimitWithTopListDto) {
    return await this.leadershipService.listOfLeadership(dto);
  }

  @ApiOperation({ summary: 'Top lists by school' })
  @Get('list-of-leadership-by-school')
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async listOfLeadershipBySchool(@Query() dto: LimitWithTopListBySchoolDto) {
    return await this.leadershipService.listOfLeadershipBySchool(dto);
  }
}
