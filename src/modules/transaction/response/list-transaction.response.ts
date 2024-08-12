import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationRes } from 'src/common/response-class/pagination.response';
import { TransactionEntity } from '../entity/transaction.entity';

export class ListTransactionResponse extends CoreApiResponse {
  @ApiProperty({ type: [TransactionEntity] })
  data: TransactionEntity[];

  @ApiProperty({ type: PaginationRes, example: PaginationRes })
  pagination: PaginationRes;
}