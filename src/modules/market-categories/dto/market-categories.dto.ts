import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsJSON } from 'class-validator';

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
  @IsJSON()
  background?: Record<string, any>;

  @ApiProperty({ example: '{}' })
  @IsOptional()
  @IsJSON()
  avatar?: Record<string, any>;

  @ApiProperty({ example: new Date() })
  @IsOptional()
  created_at?: Date;

  @ApiProperty({ example: new Date() })
  @IsOptional()
  updated_at?: Date;
}

export class UpdateMarketCategoryDto extends PartialType(
  CreateMarketCategoryDto,
) {}
