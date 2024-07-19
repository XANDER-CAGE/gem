import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationRes } from 'src/common/response-class/pagination.response';
import { MarketCategoryEntity } from '../entity/market-categories.entity';

export class ListMarketCategoriesResponse extends CoreApiResponse {
  @ApiProperty({ type: [MarketCategoryEntity] })
  data: MarketCategoryEntity[];

  @ApiProperty({ type: PaginationRes, example: PaginationRes })
  pagination: PaginationRes;
}
