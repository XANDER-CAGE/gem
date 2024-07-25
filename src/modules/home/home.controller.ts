import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssignChannelDto } from './dto/assign-channel.dto';
import { HomeService } from './home.service';

@ApiTags('Home')
@Controller()
export class AssignController {
  constructor(private readonly assignService: HomeService) {}
  @Post('assign/channel')
  async assignChannel(@Body() dto: AssignChannelDto) {
    return await this.assignService.assignChannel(dto);
  }
}
