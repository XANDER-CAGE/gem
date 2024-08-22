import { ApiProperty } from '@nestjs/swagger';

export class AchievementEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  view: object;
  @ApiProperty()
  type: string;
  @ApiProperty()
  is_active: boolean;
  @ApiProperty()
  deleted_at: Date;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}
