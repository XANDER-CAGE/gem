import { ApiProperty } from '@nestjs/swagger';

export class RankedStudentEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  position: number;
  @ApiProperty()
  avatar?: string;
  @ApiProperty()
  student_id: string;
  @ApiProperty()
  level_id: string;
  @ApiProperty()
  gem: number;
  @ApiProperty()
  deleted_at?: Date;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}
