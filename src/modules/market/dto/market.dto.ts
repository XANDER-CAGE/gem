import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
  IsDecimal,
  IsJSON,
} from 'class-validator';

export class CreateMarketDto {
  @ApiProperty({ example: 'Market Name' })
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Market Description' })
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  description: string;

  @ApiProperty({ example: '{}' })
  @IsOptional()
  @IsJSON()
  background: Record<string, any>;

  @ApiProperty({ example: '{}' })
  @IsOptional()
  @IsJSON()
  avatar: Record<string, any>;

  @ApiProperty({ default: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  category_id: string;

  @ApiProperty({ example: 4.5 })
  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '2' })
  rating: number;

  @ApiProperty({ example: new Date() })
  @IsNotEmpty()
  created_at: Date;

  @ApiProperty({ example: new Date() })
  @IsNotEmpty()
  updated_at: Date;
}

export class UpdateMarketDto extends PartialType(CreateMarketDto) {}
