import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateChannelDto {
  @ApiProperty({ default: 'Attendance' })
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    default: 'Attendance is one of the ways where u can earn gem',
  })
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  description?: string;

  @ApiProperty({ default: 10 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  reward_gem: number;

  @ApiPropertyOptional({ default: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  badge_id?: string;
}

export class UpdateChannelDto extends PartialType(CreateChannelDto) {}
