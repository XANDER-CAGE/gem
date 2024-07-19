import { ApiProperty } from '@nestjs/swagger';

export class TransactionEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  product_id?: string;

  @ApiProperty()
  channel_id?: string;

  @ApiProperty()
  streak_id?: string;

  @ApiProperty()
  profile_id: string;

  @ApiProperty()
  count?: number;

  @ApiProperty()
  total_gem: number;

  @ApiProperty()
  deleted_at: Date;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
