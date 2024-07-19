import { ApiProperty } from '@nestjs/swagger';

export class StreakEntity {
  @ApiProperty()
  channel_id: string;
  @ApiProperty()
  streak_day: number;
  @ApiProperty()
  streak_reward: number;
  @ApiProperty()
  is_last: boolean;
  @ApiProperty()
  created_at?: Date;
  @ApiProperty()
  updated_at?: Date;
  @ApiProperty()
  deleted_at?: Date;
}