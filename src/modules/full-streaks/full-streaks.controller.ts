import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FullStreaksService } from './full-streaks.service';
import { CreateFullStreakDto } from './dto/create-full-streak.dto';
import { UpdateFullStreakDto } from './dto/update-full-streak.dto';

@Controller('full-streaks')
export class FullStreaksController {
  constructor(private readonly fullStreaksService: FullStreaksService) {}

  @Post()
  create(@Body() createFullStreakDto: CreateFullStreakDto) {
    return this.fullStreaksService.create(createFullStreakDto);
  }

  @Get()
  findAll() {
    return this.fullStreaksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fullStreaksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFullStreakDto: UpdateFullStreakDto) {
    return this.fullStreaksService.update(+id, updateFullStreakDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fullStreaksService.remove(+id);
  }
}
