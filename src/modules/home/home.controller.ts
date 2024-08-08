import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AssignChannelDto } from './dto/assign-channel.dto';
import { HomeService } from './home.service';
import { AssignAchievementDto } from './dto/assign-achievement.dto';
import { BuyProductDto } from '../market-products/dto/buy.product.dto';
import { IMyReq } from 'src/common/interface/my-req.interface';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/common/decorator/roles.decorator';

@ApiTags('Home')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller()
export class AssignController {
  constructor(private readonly assignService: HomeService) {}

  @Roles(Role.app_admin)
  @Post('assign/channel')
  async assignChannel(@Body() dto: AssignChannelDto) {
    return await this.assignService.assignChannel(dto);
  }

  @Roles(Role.app_admin)
  @Post('assign/achievement')
  async assignAchievement(@Body() dto: AssignAchievementDto) {
    return await this.assignService.assignAchievement(
      dto.profile_id,
      dto.achievement_id,
    );
  }

  @Roles(Role.student)
  @Post('product/buy')
  async productBuy(@Body() dto: BuyProductDto, @Req() req: IMyReq) {
    return await this.assignService.buyProduct(dto, req.user.profile);
  }
}
