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
  badge_id?: string;
  @ApiProperty()
  channel_categories_id?: string;
  @ApiProperty()
  product_id:string;
  @ApiProperty()
  type:string
  @ApiProperty()
  deleted_at: Date;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}