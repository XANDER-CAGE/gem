import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, IsObject } from 'class-validator';

export class CreateStudentProfileDto {
  @ApiProperty({ example: '{}' })
  @IsOptional()
  @IsObject()
  avatar?: object;

  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  @IsString()
  @Length(24)
  student_id: string;
}
