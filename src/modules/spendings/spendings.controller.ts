import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpendingsService } from './spendings.service';
import { CreateSpendingDto, UpdateSpendingDto } from './dto/spendings.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags("Spendings")
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
