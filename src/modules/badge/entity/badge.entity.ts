import { ApiProperty } from '@nestjs/swagger';

export class BadgeEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  view: object;
  @ApiProperty()
  description: string;
  @ApiProperty()
  course_id: string;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}
