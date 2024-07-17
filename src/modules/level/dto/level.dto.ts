import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateLevelDto {
  @ApiProperty({ default: '507f1f77bcf86cd799439011' })
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

  @ApiProperty({ default: '507f1f77bcf86cd799439012' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  badge_id?: string;

  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '2' })
  free_gem: number;
}

export class UpdateLevelDto extends PartialType(CreateLevelDto) {}
