import { ApiProperty, PartialType } from '@nestjs/swagger';

export class ICreateProductReview {
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

export class IFindAllProductReview {
  total: number;
  data: ICreateProductReview[];
}
export class IUpdateProductReview extends PartialType(ICreateProductReview) {}
