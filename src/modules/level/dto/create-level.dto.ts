import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLevelDto {
  @ApiProperty({ example: 'Level Name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  @IsInt()
  reward_point: number;

  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  free_gem: number;
}
