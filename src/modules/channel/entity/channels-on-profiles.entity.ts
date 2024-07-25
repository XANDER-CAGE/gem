import { ApiProperty } from '@nestjs/swagger';

export class ChannelsOnProfilesEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  profile_id: string;
  @ApiProperty()
  channel_id: string;
  @ApiProperty()
  streak_id: string;
  @ApiProperty()
  is_done: boolean;
  @ApiProperty()
  joined_at: Date;
  @ApiProperty()
  deleted_at: Date;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}
