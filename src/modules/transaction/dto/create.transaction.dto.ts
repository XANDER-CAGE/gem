import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
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
  @IsString()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  uid: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({
    description: 'The status of the transaction.',
    enum: TransactionStatusEnum,
    enumName: 'TransactionStatusEnum',
    example: TransactionStatusEnum.REFUND,
  })
  @IsEnum(TransactionStatusEnum, {
    message: 'Status must be a valid TransactionStatusEnum value',
  })
  status: TransactionStatusEnum;
}
