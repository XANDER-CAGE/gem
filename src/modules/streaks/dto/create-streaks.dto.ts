import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStreakDto {
  @ApiProperty({ example: 10.0 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  streak_reward: number;
}
