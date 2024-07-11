import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty({
    default: 'Attendance is one of the ways where u can earn gem',
  })
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  desctription: string;

  @ApiProperty({ default: 10 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  rewardGem: number;

  @ApiProperty({ default: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  badgeId: string;
}
