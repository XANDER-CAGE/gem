import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { TransactionHistoryEnum } from 'src/modules/transaction/enum/transaction.history.enum';

export class PaginationDto {
  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number;
}
export class TransactionListDto extends PaginationDto {
  @ApiPropertyOptional({ example: '2023-01-01T00:00:00Z' })
  @IsOptional()
  start_date: Date;

  @ApiPropertyOptional({ example: '2023-12-31T23:59:59Z' })
  @IsOptional()
  end_date: Date;

  @ApiPropertyOptional({
    example: TransactionHistoryEnum.INCOME,
    enum: TransactionHistoryEnum,
  })
  @IsOptional()
  @IsEnum(TransactionHistoryEnum)
  listType: TransactionHistoryEnum;
}

export class TransactionFinishedList extends PaginationDto {
  @ApiPropertyOptional({ example: '230020' })
  @IsOptional()
  uid: string;

  @ApiPropertyOptional({ example: 'item name' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ example: '2023-01-01T00:00:00Z' })
  @IsOptional()
  start_date: Date;

  @ApiPropertyOptional({ example: '2023-12-31T23:59:59Z' })
  @IsOptional()
  end_date: Date;
}