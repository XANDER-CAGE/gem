import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateLevelDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  id?: string;

  @ApiProperty({ example: 'Level Name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  level: number;

  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  @IsInt()
  reward_point: number;

  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  badge_id?: string;

  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  free_gem: number;
}
