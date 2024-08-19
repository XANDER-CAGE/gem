import { ApiProperty } from '@nestjs/swagger';

export class ChannelEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  reward_gem: number;
  @ApiProperty()
  has_streak: boolean;
  @ApiProperty()
  deleted_at: Date;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}
