import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDecimal,
  IsJSON,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateStudentProfileDto {
  @ApiProperty({ default: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  id?: string;

  @ApiProperty({ example: '{}' })
  @IsOptional()
  @IsJSON()
  avatar?: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  level: number;

  @ApiProperty({ default: '507f1f77bcf86cd799439012' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  student_id?: string;

  @ApiProperty({ default: '507f1f77bcf86cd799439013' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  streak_id?: string;

  @ApiProperty({ default: '507f1f77bcf86cd799439014' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  level_id?: string;

  @ApiProperty({ example: 100.0 })
  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '2' })
  gem: number;
}

export class UpdateStudentProfileDto extends PartialType(
  CreateStudentProfileDto,
) {}
