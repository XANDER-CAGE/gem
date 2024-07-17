import { ApiProperty, PartialType } from '@nestjs/swagger';

export class ICreateStreak {
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

export class IFindAllStreaks {
  total: number;
  data: ICreateStreak[];
}
export class IUpdateStreak extends PartialType(ICreateStreak) {}
