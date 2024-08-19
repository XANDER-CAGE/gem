import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { ProductEntity } from '../entity/product.interface';

export class CreateMarketProductResponse extends CoreApiResponse {
  @ApiProperty({ type: ProductEntity, example: ProductEntity })
  data: ProductEntity;
}
