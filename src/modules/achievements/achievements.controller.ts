import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Post()
  create(@Body() dto: CreateAchievementDto) {
    return this.achievementsService.create(dto);
  }

  @Get()
  findAll(@Query() dto: PaginationDto) {
    return this.achievementsService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.achievementsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAchievementDto) {
    return this.achievementsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.achievementsService.remove(id);
  }
}
