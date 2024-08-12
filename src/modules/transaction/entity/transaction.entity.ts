import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

export class TransactionHistoryEntity extends TransactionEntity {
  @ApiPropertyOptional()
  channel_obj: object;
  @ApiPropertyOptional()
  streak_obj: object;
  @ApiPropertyOptional()
  level_obj: object;
  @ApiPropertyOptional()
  full_streak_obj: object;
  @ApiPropertyOptional()
  badge_obj: object;
  @ApiPropertyOptional()
  product_obj: object;
}
