import { ApiProperty } from '@nestjs/swagger';
export class LeadershipEntity {
  @ApiProperty()
  id?: string;
  @ApiProperty()
  profile_id: string;
  @ApiProperty()
  last_position_by_gem: number;
  @ApiProperty()
  last_position_by_earning: number;
}

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
