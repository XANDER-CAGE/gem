import {
  Controller,
  Post,
  Body,
  NotFoundException,
  NotAcceptableException,
  UseGuards,
} from '@nestjs/common';
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
import { AssignAttendance } from './dto/assign-attendance.dto';
import { StudentProfilesService } from '../student-profiles/student-profiles.service';
import { RolesGuard } from 'src/common/guard/roles.guard';

@ApiTags('Attendance')
@ApiBearerAuth()
@Controller('attendance')
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly profileService: StudentProfilesService,
  ) {}

  @ApiOperation({ summary: 'Assign attendance' })
  @UseGuards(RolesGuard)
  @Roles(Role.app_admin)
  @Post('assign')
  @ApiOkResponse({ type: DeleteApiResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async assignAttendance(@Body() dto: AssignAttendance) {
    const student = await this.profileService.getStudentByColumn(
      'uid',
      dto.uid,
    );
    if (!student) throw new NotFoundException('Student not found');
    if (student.is_blocked) {
      throw new NotAcceptableException('Student is blocked');
    }
    await this.attendanceService.assignAttendance(student.id, dto.is_done);
    return CoreApiResponse.success(null);
  }
}
