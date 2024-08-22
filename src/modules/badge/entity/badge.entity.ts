import { ApiProperty } from '@nestjs/swagger';

export class BadgeEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  view: object;
  @ApiProperty()
  description: string;
  @ApiProperty()
  reward_gem: number;
  @ApiProperty()
  achievement_id: string;
  @ApiProperty()
  progress: number;
  @ApiProperty()
  level: number;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}
