import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
}
