import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { LeadershipService } from './leadership.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ErrorApiResponse } from 'src/common/response-class/error.response';
import {
  LimitWithTopListDto,
  SchoolsTypeDto,
} from './dto/create-leadership.dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { IMyReq } from 'src/common/interface/my-req.interface';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('Leadership')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.app_admin)
@Controller('leadership')
export class LeadershipController {
  constructor(private readonly leadershipService: LeadershipService) {}

  @Roles(Role.student)
  @ApiOperation({ summary: 'Top lists by school' })
  @Get()
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async listOfLeadershipBySchool(
    @Query() dto: LimitWithTopListDto,
    @Req() req: IMyReq,
  ) {
    const data = await this.leadershipService.listOfLeadershipBySchool(
      dto,
      req.profile.id,
    );
    return CoreApiResponse.success(data);
  }

  @Public()
  @ApiOperation({ summary: 'Top 20 list by all schools( Overall 100)' })
  @Get('/topListAllSchools')
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async topListByAllSchools(@Query() dto: SchoolsTypeDto) {
    const data = await this.leadershipService.topListByAllSchools(
      dto.school_type,
    );
    return CoreApiResponse.success(data);
  }
}
