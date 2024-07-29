import { ApiProperty } from '@nestjs/swagger';

export class LevelEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  level: number;
  @ApiProperty()
  reward_point: number;
  @ApiProperty()
  badge_id?: string;
  @ApiProperty()
  free_gem: number;
  @ApiProperty()
  deleted_at?: Date;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}
