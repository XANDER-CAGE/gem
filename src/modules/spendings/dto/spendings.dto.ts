import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsDecimal,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateSpendingDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  market_product_id: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  count: number;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  student_id: string;

  @ApiProperty({ example: 99.99 })
  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '2' })
  total_price: number;
  
  @ApiProperty({ example: new Date() })
  @IsOptional()
  created_at?: Date;

  @ApiProperty({ example: new Date() })
  @IsOptional()
  updated_at?: Date;
}

export class UpdateSpendingDto extends PartialType(CreateSpendingDto){}