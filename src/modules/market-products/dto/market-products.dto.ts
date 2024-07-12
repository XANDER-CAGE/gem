import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsJSON,
  IsDecimal,
  IsInt,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateMarketProductDto {
  @ApiProperty({ default: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @MinLength(1)
  @MaxLength(24)
  market_id: number;

  @ApiProperty({ example: 'Product Name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Product Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '{}' })
  @IsOptional()
  @IsJSON()
  avatar?: Record<string, any>;

  @ApiProperty({ example: 'Product Type' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ example: 99.99 })
  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '2' })
  price: number;

  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  @IsInt()
  remaining_count: number;

  @ApiProperty({ example: new Date() })
  @IsOptional()
  created_at?: Date;

  @ApiProperty({ example: new Date() })
  @IsOptional()
  updated_at?: Date;
}

export class UpdateMarketProductDto extends PartialType(
  CreateMarketProductDto,
) {}
