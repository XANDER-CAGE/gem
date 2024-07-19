import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { ProductReviewEntity } from '../entity/product-reviews.entity';

export class CreateProductReviewResponse extends CoreApiResponse {
  @ApiProperty({ type: ProductReviewEntity, example: ProductReviewEntity })
  data: ProductReviewEntity;
}
