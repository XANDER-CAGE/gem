import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateStudentProfileDto } from './create-student-profile.dto';

export class UpdateStudentProfileDto extends PartialType(
  OmitType(CreateStudentProfileDto, ['student_id'] as const),
) {
  gem: number;
}
