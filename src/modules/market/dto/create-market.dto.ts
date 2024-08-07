import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsJSON,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateMarketDto {
  @ApiProperty({ example: 'Market Name' })
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Market Description' })
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  description: string;

  @ApiProperty({ example: '{}' })
  @IsOptional()
  @IsJSON()
  background: string;

  @ApiProperty({ example: '{}' })
  @IsOptional()
  @IsJSON()
  avatar: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @MinLength(1)
  @MaxLength(24)
  category_id: string;
}
