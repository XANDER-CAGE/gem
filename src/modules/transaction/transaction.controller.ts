import { Controller, Get, Query, Param, UseGuards, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { IdDto } from 'src/common/dto/id.dto';
// import { CreateEarningDto } from './dto/create-earning-transaction.dto';
// import { CreateSpendingDto } from './dto/create-spending-transaction.dto';
import {
  PaginationDto,
  PaginationForTransactionHistory,
} from 'src/common/dto/pagination.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ErrorApiResponse } from 'src/common/response-class/error.response';
import {
  ListTransactionHistoryResponse,
  ListTransactionResponse,
} from './response/list-transaction.response';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { CreateTransactionResponse } from './response/create-transaction.response';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/role.enum';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.student)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // @Post('earning')
  // createEarning(@Body() dto: CreateEarningDto) {
  //   return this.transactionService.createEarning(dto);
  // }

  // @Post('spending')
  // createSpending(@Body() dto: CreateSpendingDto) {
  //   return this.transactionService.createSpending(dto);
  // }

  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiOkResponse({ type: ListTransactionResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findAll(@Query() dto: PaginationDto) {
    const { total, data } = await this.transactionService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiOkResponse({ type: CreateTransactionResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findOne(@Param() { id }: IdDto) {
    const data = await this.transactionService.findOne(id);
    return CoreApiResponse.success(data);
  }

  @Roles(Role.student)
  @ApiOperation({ summary: 'Transaction history' })
  @Post('transaction-history')
  @ApiOkResponse({ type: ListTransactionHistoryResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async transactionHistory(@Query() dto: PaginationForTransactionHistory) {
    const { total, data } =
      await this.transactionService.transactionHistory(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
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
