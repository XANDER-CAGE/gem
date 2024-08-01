import { ApiProperty } from '@nestjs/swagger';

export class ChannelEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  desctription?: string;
  @ApiProperty()
  reward_gem: number;
  @ApiProperty()
  badge_id?: string;
  @ApiProperty()
  channel_categories_id?: string;
  @ApiProperty()
  has_streak: boolean;
  @ApiProperty()
  type: string;
  @ApiProperty()
  level: number;
  @ApiProperty()
  progress: number;
  @ApiProperty()
  deleted_at: Date;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}
