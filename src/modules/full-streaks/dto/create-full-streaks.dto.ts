import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsInt,
} from 'class-validator';

export class CreateFullStreakDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  channel_id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  @IsOptional()
  product_id: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  level: number;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  @IsOptional()
  badge_id: string;
}
