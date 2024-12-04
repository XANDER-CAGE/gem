import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateStudentProfileDto } from './create-student-profile.dto';
import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateStudentProfileDto extends PartialType(
  OmitType(CreateStudentProfileDto, ['student_id'] as const),
) {
  gem: number;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @MinLength(1)
  @MaxLength(24)
  ava?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @MinLength(1)
  @MaxLength(24)
  streak_background?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @MinLength(1)
  @MaxLength(24)
  frame?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @MinLength(1)
  @MaxLength(24)
  app_icon?: string;
}
