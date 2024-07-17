import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  CreateEarningDto,
  CreateSpendingDto,
  UpdateEarningDto,
  UpdateSpendingDto,
} from './dto/create-transaction.dto';
import { IdDto } from 'src/common/dto/id.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('earning')
  createEarning(@Body() dto: CreateEarningDto) {
    return this.transactionService.create(dto);
  }

  @Post('spending')
  createSpending(@Body() dto: CreateSpendingDto) {
    return this.transactionService.create(dto);
  }

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: IdDto) {
    return this.transactionService.findOne(id);
  }

  @Patch('spending/:id')
  updateSpending(@Param() { id }: IdDto, @Body() dto: UpdateSpendingDto) {
    return this.transactionService.update(id, dto);
  }

  @Patch('earning/:id')
  updateEarning(@Param() { id }: IdDto, @Body() dto: UpdateEarningDto) {
    return this.transactionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param() { id }: IdDto) {
    return this.transactionService.remove(id);
  }
}
