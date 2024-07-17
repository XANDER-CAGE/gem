import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsJSON,
  MinLength,
  MaxLength,
  IsNumber,
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
  
  @ApiProperty({ default: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @MinLength(1)
  @MaxLength(24)
  category_id: string;

  @ApiProperty({ example: 4.5 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  rating: number;
}

export class UpdateMarketDto extends PartialType(CreateMarketDto) {}
