import { ApiProperty } from '@nestjs/swagger';

export class FullStreakEntity {
  @ApiProperty()
  channel_id: string;
  @ApiProperty()
  streak_level: number;
  @ApiProperty()
  badge_id: string;
  @ApiProperty()
  product_id: string;
  @ApiProperty()
  deleted_at?: Date;
  @ApiProperty()
  created_at?: Date;
  @ApiProperty()
  updated_at?: Date;
}
