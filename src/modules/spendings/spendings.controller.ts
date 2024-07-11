import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpendingsService } from './spendings.service';
import { CreateSpendingDto } from './dto/create-spending.dto';
import { UpdateSpendingDto } from './dto/update-spending.dto';

@Controller('spendings')
export class SpendingsController {
  constructor(private readonly spendingsService: SpendingsService) {}

  @Post()
  create(@Body() createSpendingDto: CreateSpendingDto) {
    return this.spendingsService.create(createSpendingDto);
  }

  @Get()
  findAll() {
    return this.spendingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spendingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpendingDto: UpdateSpendingDto) {
    return this.spendingsService.update(+id, updateSpendingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spendingsService.remove(+id);
  }
}
