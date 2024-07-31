import { Controller, Get } from '@nestjs/common';
import { LeadershipService } from './leadership.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ErrorApiResponse } from 'src/common/response-class/error.response';

@ApiTags("Leadership")
@Controller('leadership')
export class LeadershipController {
  constructor(private readonly leadershipService: LeadershipService) {}

  @ApiOperation({ summary: 'Save to the leadership' })
  @Get('save-leadership')
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async saveLeadership() {
    return await this.leadershipService.saveLeadership();
  }
}
