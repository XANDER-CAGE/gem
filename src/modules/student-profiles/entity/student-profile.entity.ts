import { ApiProperty } from '@nestjs/swagger';

export class StudentProfileEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  avatar?: string;
  @ApiProperty()
  student_id: string;
  @ApiProperty()
  gem: number;
  @ApiProperty()
  deleted_at?: Date;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}