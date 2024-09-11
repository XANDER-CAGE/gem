import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/common/interface/buffered-file.interface';
import { LeadershipService } from '../leadership/leadership.service';
import { AttendanceService } from '../attendance/attendance.service';

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

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload/homework')
  @Roles(Role.student)
  @UseInterceptors(FileInterceptor('file'))
  async uploadHomework(@UploadedFile() file: BufferedFile, @Req() req: IMyReq) {
    await this.homeService.uploadHomework(file, req.user.id, req.profile.id);
    return CoreApiResponse.success(null);
  }

  @Cron('0 30 9 * * *')
  async handleGradeCron() {
    await this.attendanceService.attendanceCron();
    await this.homeService.handleGradeCron();
    await this.leadershipService.saveLeadership();
  }
}
