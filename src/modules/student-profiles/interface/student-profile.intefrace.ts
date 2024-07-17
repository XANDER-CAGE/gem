import { ApiProperty, PartialType } from '@nestjs/swagger';

export class ICreateStudentProfile {
  @ApiProperty()
  id?: string;
  @ApiProperty()
  avatar?: string;
  @ApiProperty()
  level: number;
  @ApiProperty()
  student_id?: string;
  @ApiProperty()
  streak_id?: string;
  @ApiProperty()
  level_id?: string;
  @ApiProperty()
  gem: number;
  @ApiProperty()
  deleted_at?: Date;
  @ApiProperty()
  created_at?: Date;
  @ApiProperty()
  updated_at?: Date;
}
export class IFindAllStudentProfile {
  total: number;
  data: ICreateStudentProfile[];
}

export class IUpdateStudentProfile extends PartialType(ICreateStudentProfile) {}
