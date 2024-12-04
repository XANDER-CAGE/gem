import { ApiProperty } from '@nestjs/swagger';

export class StudentProfileEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  student_id: string;
  @ApiProperty()
  gem: number;
  @ApiProperty()
  ava: string;
  @ApiProperty()
  streak_background: string;
  @ApiProperty()
  frame: string;
  @ApiProperty()
  app_icon?: string;
  @ApiProperty()
  deleted_at?: Date;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}
