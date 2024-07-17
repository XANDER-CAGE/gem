import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsBoolean,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class CreateStreakDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  channel_id: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  streak_day: number;

  @ApiProperty({ example: 10.00 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  streak_reward: number;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  is_last: boolean;
}
export class UpdateStreakDto extends PartialType(CreateStreakDto) {}
