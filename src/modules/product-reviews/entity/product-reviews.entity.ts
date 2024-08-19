import { ApiProperty } from '@nestjs/swagger';

export class ProductReviewEntity {
  @ApiProperty()
  profile_id: string;
  @ApiProperty()
  product_id: string;
  @ApiProperty()
  message?: string;
  @ApiProperty()
  rate: number;
  @ApiProperty()
  created_at?: Date;
  @ApiProperty()
  updated_at?: Date;
}