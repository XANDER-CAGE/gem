import { Body, Controller, Post } from '@nestjs/common';
import { AssignService } from './assign.service';
import { ApiTags } from '@nestjs/swagger';
import { AssignChannelDto } from './dto/assign-channel.dto';

@ApiTags('Assign')
@Controller('assign')
export class AssignController {
  constructor(private readonly assignService: AssignService) {}
  @Post('channel')
  async assignChannel(@Body() dto: AssignChannelDto) {
    return await this.assignService.assignChannel(dto);
  }
}
