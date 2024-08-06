import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssignChannelDto } from './dto/assign-channel.dto';
import { HomeService } from './home.service';
import { AssignAchievemntDto } from './dto/assign-achievement.dto';

@ApiTags('Home')
@Controller()
export class AssignController {
  constructor(private readonly assignService: HomeService) {}
  @Post('assign/channel')
  async assignChannel(@Body() dto: AssignChannelDto) {
    return await this.assignService.assignChannel(dto);
  }

  @Post('assign/achievement')
  async assignAchievement(@Body() dto: AssignAchievemntDto) {
    return await this.assignService.assignAchievement(
      dto.profile_id,
      dto.achievement_id,
    );
  }
}
