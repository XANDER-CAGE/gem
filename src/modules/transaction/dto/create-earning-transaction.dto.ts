import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateEarningDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsString()
  @Length(24)
  profile_id: string;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsString()
  @Length(24)
  channel_id: string;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsString()
  @Length(24)
  streak_id?: string;
}
