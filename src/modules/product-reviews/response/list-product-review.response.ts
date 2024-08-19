import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationRes } from 'src/common/response-class/pagination.response';
import { ProductReviewEntity } from '../entity/product-reviews.entity';

export class ListProductReviewResponse extends CoreApiResponse {
  @ApiProperty({ type: [ProductReviewEntity] })
  data: ProductReviewEntity[];

  @ApiProperty({ type: PaginationRes, example: PaginationRes })
  pagination: PaginationRes;
}
