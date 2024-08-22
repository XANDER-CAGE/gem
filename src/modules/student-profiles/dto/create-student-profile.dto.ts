import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateStudentProfileDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  @IsString()
  @Length(24)
  student_id: string;
}
