import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { IdDto } from 'src/common/dto/id.dto';
import { CreateEarningDto } from './dto/create-earning-transaction.dto';
import { CreateSpendingDto } from './dto/create-spending-transaction.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('earning')
  createEarning(@Body() dto: CreateEarningDto) {
    return this.transactionService.createEarning(dto);
  }

  @Post('spending')
  createSpending(@Body() dto: CreateSpendingDto) {
    return this.transactionService.createSpending(dto);
  }

  @Get()
  findAll(@Query() dto: PaginationDto) {
    return this.transactionService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param() { id }: IdDto) {
    return this.transactionService.findOne(id);
  }

  // @Patch('spending/:id')
  // updateSpending(@Param() { id }: IdDto, @Body() dto: UpdateSpendingDto) {
  //   return this.transactionService.update(id, dto);
  // }

  // @Patch('earning/:id')
  // updateEarning(@Param() { id }: IdDto, @Body() dto: UpdateEarningDto) {
  //   return this.transactionService.update(id, dto);
  // }

  // @Delete(':id')
  // remove(@Param() { id }: IdDto) {
  //   return this.transactionService.remove(id);
  // }
}
