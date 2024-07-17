import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  MinLength,
  MaxLength,
  IsObject,
  IsNumber,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ default: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(24)
  market_id: string;

  @ApiProperty({ default: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @MinLength(1)
  @MaxLength(24)
  category_id: string;

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
  @IsObject()
  avatar?: Record<string, any>;

  @ApiProperty({ example: 'Product Type' })
  @IsOptional()
  @IsString()
  type: string;

  @ApiProperty({ example: 99 })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsInt()
  remaining_count: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
