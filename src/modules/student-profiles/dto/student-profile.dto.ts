import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDecimal,
  IsJSON,
} from 'class-validator';

export class CreateStudentProfileDto {
  @ApiProperty({ example: '{}' })
  @IsOptional()
  @IsJSON()
  avatar?: Record<string, any>;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  level: number;

  @ApiProperty({ example: 100.0 })
  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '2' })
  gem: number;

  @ApiProperty({ example: new Date() })
  @IsOptional()
  created_at?: Date;

  @ApiProperty({ example: new Date() })
  @IsOptional()
  updated_at?: Date;
}

export class UpdateStudentProfileDto extends PartialType(
  CreateStudentProfileDto,
) {}
