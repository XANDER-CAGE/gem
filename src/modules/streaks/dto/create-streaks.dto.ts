import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
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

  @ApiProperty({ example: 10.0 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  streak_reward: number;
}
