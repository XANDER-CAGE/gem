import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TransactionStatusEnum } from '../enum/transaction.history.enum';

export class CreateManualTransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  uid: string;
}

export class TransactionUpdateStatus {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: TransactionStatusEnum;
}
