import { Controller, Post, Body } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { DeleteApiResponse } from 'src/common/response-class/all-null.response';
import { ErrorApiResponse } from 'src/common/response-class/error.response';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { AssignChannelDto } from './dto/assign-channel.dto';

@ApiTags('Attendance')
@ApiBearerAuth()
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @ApiOperation({ summary: 'Assign channel' })
  @Roles(Role.app_admin)
  @Post('assign')
  @ApiOkResponse({ type: DeleteApiResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async assignChannel(@Body() dto: AssignChannelDto) {
    await this.attendanceService.assignChannel(dto);
    return CoreApiResponse.success(null);
  }
}
