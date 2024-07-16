import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { transactionTypeValidator } from 'src/common/validator/transaction.validator';

type transactionType = 'spending' | 'earning';

export class CreateTransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(24)
  profile_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(24)
  channel_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(24)
  streak_id: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  total: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  count: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['spending', 'earning'])
  @Validate(transactionTypeValidator, ['count', 'channel_id', 'streak_id'])
  type: transactionType;
}
