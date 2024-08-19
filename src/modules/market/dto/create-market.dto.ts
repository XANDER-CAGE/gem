import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
  IsObject,
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

  @ApiProperty({ example: {} })
  @IsOptional()
  @IsObject()
  background: object;

  @ApiProperty({ example: {} })
  @IsOptional()
  @IsObject()
  avatar: object;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @MinLength(1)
  @MaxLength(24)
  category_id: string;
}
