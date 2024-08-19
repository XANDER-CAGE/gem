import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateMarketCategoryDto {
  @ApiProperty({ example: 'Category Name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Category Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: {} })
  @IsOptional()
  @IsObject()
  background?: object;

  @ApiProperty({ example: {} })
  @IsOptional()
  @IsObject()
  avatar?: object;
}
