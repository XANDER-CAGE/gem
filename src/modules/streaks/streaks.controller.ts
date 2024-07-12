import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { CreateStreakDto, UpdateStreakDto } from './dto/streaks.dto';

@Controller('streaks')
export class StreaksController {
  constructor(private readonly streaksService: StreaksService) {}

  @Post()
  create(@Body() createStreakDto: CreateStreakDto) {
    return this.streaksService.create(createStreakDto);
  }

  @Get()
  findAll() {
    return this.streaksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.streaksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStreakDto: UpdateStreakDto) {
    return this.streaksService.update(+id, updateStreakDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.streaksService.remove(+id);
  }
}
