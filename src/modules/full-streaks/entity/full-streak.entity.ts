import { ApiProperty } from '@nestjs/swagger';

export class FullStreakEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  channel_id: string;
  @ApiProperty()
  level: number;
  @ApiProperty()
  is_last: boolean;
  @ApiProperty()
  badge_id?: string;
  @ApiProperty()
  product_id?: string;
  @ApiProperty()
  deleted_at?: Date;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}
