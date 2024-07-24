import { ApiProperty } from '@nestjs/swagger';
import { StreakEntity } from 'src/modules/streaks/entity/streaks.entity';

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
  streaks: StreakEntity[];
  @ApiProperty()
  deleted_at: Date;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}