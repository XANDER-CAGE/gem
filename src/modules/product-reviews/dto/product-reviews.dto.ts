import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateProductReviewDto {
  @ApiProperty({ default: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(24)
  profile_id: string;

  @ApiProperty({ default: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(24)
  product_id: string;

  @ApiProperty({ example: 'This is a review message.' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ example: 5 })
  @IsNotEmpty()
  @IsInt()
  rate: number;
}

export class UpdateProductReviewDto extends PartialType(
  CreateProductReviewDto,
) {}
