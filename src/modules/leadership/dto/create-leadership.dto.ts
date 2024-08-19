import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateLeadershipDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  id?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  profile_id: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  last_position_by_gem: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  last_position_by_earning: number;
}

export class LimitWithTopListDto {
  @ApiProperty({ example: 0 })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  limit: number;
}

