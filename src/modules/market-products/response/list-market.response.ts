import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationRes } from 'src/common/response-class/pagination.response';
import { ProductEntity } from '../entity/product.interface';

export class ListMarketProductResponse extends CoreApiResponse {
  @ApiProperty({ type: [ProductEntity] })
  data: ProductEntity[];

  @ApiProperty({ type: PaginationRes, example: PaginationRes })
  pagination: PaginationRes;
}
