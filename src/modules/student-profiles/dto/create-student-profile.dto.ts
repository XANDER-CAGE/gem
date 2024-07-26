import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsJSON,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class CreateStudentProfileDto {
  @ApiProperty({ example: '{}' })
  @IsOptional()
  @IsJSON()
  avatar?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  student_id?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439014' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  level_id?: string;

  @ApiProperty({ example: 100.0 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  gem: number;
}
