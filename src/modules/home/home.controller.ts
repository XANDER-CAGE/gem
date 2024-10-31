import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HomeService } from './home.service';
import { AssignAchievementDto } from './dto/assign-achievement.dto';
import { BuyProductDto } from '../market-products/dto/buy.product.dto';
import { IMyReq } from 'src/common/interface/my-req.interface';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Cron } from '@nestjs/schedule';
import { DeleteApiResponse } from 'src/common/response-class/all-null.response';
import { ErrorApiResponse } from 'src/common/response-class/error.response';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { LeadershipService } from '../leadership/leadership.service';
import { AttendanceService } from '../attendance/attendance.service';
import { UploadHomeworkDto } from './dto/upload-homework.dto';

@ApiTags('Home')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller()
export class HomeController {
  constructor(
    private readonly homeService: HomeService,
    private readonly leadershipService: LeadershipService,
    private readonly attendanceService: AttendanceService,
  ) {}

  @ApiOperation({ summary: 'Assign achievement' })
  @ApiBody({ type: AssignAchievementDto })
  @Roles(Role.app_admin)
  @Post('assign/achievement')
  @ApiOkResponse({ type: DeleteApiResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async assignAchievement(@Body() dto: AssignAchievementDto) {
    await this.homeService.assignAchievement(
      dto.profile_id,
      dto.achievement_id,
    );
    return CoreApiResponse.success(null);
  }

  @ApiOperation({ summary: 'Buy product' })
  @ApiBody({ type: BuyProductDto })
  @Roles(Role.student)
  @Post('product/buy')
  @ApiOkResponse({ type: DeleteApiResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async productBuy(@Body() dto: BuyProductDto, @Req() req: IMyReq) {
    await this.homeService.buyProduct(dto, req.user.profile);
    return CoreApiResponse.success(null);
  }

  @Post('upload/homework')
  @Roles(Role.student)
  async uploadHomework(@Body() dto: UploadHomeworkDto, @Req() req: IMyReq) {
    await this.homeService.uploadHomework(dto, req.user.id, req.profile.id);
    return CoreApiResponse.success(null);
  }

  @Cron('0 0 12 * * *')
  async handleGradeCron() {
    await this.attendanceService.attendanceCron();
    await this.homeService.handleGradeCron();
    await this.leadershipService.saveLeadership();
  }
}
