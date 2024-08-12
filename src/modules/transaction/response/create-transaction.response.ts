import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import {
  TransactionEntity,
  TransactionHistoryEntity,
} from '../entity/transaction.entity';

export class CreateTransactionResponse extends CoreApiResponse {
  @ApiProperty({ type: TransactionEntity, example: TransactionEntity })
  data: TransactionEntity;
}

export class TransactionHistoryResponse extends CoreApiResponse {
  @ApiProperty({
    type: TransactionHistoryEntity,
    example: TransactionHistoryEntity,
  })
  data: TransactionHistoryEntity;
}
