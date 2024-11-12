import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  MinLength,
  MaxLength,
  IsObject,
  IsNumber,
  IsBoolean
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(24)
  market_id: string;

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
  avatar?: string;

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

  @ApiProperty({ example: false })
  @IsBoolean()
  limited: boolean;

  @ApiProperty({ example: 'item' })
  @IsString()
  type_item: string;
}
