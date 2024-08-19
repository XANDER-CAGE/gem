import { Controller, Query, UseGuards, Post, Body, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionListDto } from 'src/common/dto/pagination.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ErrorApiResponse } from 'src/common/response-class/error.response';
import { ListTransactionHistoryResponse } from './response/list-transaction.response';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { CreateManualTransactionDto } from './dto/create.transaction.dto';
import { IMyReq } from 'src/common/interface/my-req.interface';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Roles(Role.app_admin)
  @Post('manual')
  async createEarning(
    @Body() dto: CreateManualTransactionDto,
    @Req() req: IMyReq,
  ) {
    const data = await this.transactionService.createManual(dto, req.user.id);
    return CoreApiResponse.success(data);
  }

  @Roles(Role.app_admin, Role.student)
  @ApiOperation({ summary: 'Transaction history' })
  @Post('history')
  @ApiOkResponse({ type: ListTransactionHistoryResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async transactionHistory(
    @Query() dto: TransactionListDto,
    @Req() req: IMyReq,
  ) {
    const { total, data } = await this.transactionService.transactionHistory(
      dto,
      req.profile.id,
    );
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }
}
