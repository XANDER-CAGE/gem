import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsJSON,
  IsString,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMarketCategoryDto {
  @ApiProperty({ example: 'Category Name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Category Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '{}' })
  @IsOptional()
  @IsString()
  background?: string;

  @ApiProperty({ example: '{}' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ example: new Date() })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  created_at?: Date;

  @ApiProperty({ example: new Date() })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updated_at?: Date;
}

export class UpdateMarketCategoryDto extends PartialType(
  CreateMarketCategoryDto,
) {}
