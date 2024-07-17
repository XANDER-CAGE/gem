import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateSpendingDto {
  @ApiProperty({ default: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsString()
  @Length(24)
  profile_id: string;

  @ApiProperty({ default: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsString()
  @Length(24)
  product_id: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  total: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  count: number;
}

export class CreateEarningDto {
  @ApiProperty({ default: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsString()
  @Length(24)
  profile_id: string;

  @ApiPropertyOptional({ default: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsString()
  @Length(24)
  channel_id: string;
}

export class UpdateSpendingDto extends PartialType(CreateSpendingDto) {}
export class UpdateEarningDto extends PartialType(CreateEarningDto) {}
