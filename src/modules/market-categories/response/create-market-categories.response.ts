import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { MarketCategoryEntity } from '../entity/market-categories.entity';

export class CreateMarketCategoriesResponse extends CoreApiResponse {
  @ApiProperty({ type: MarketCategoryEntity, example: MarketCategoryEntity })
  data: MarketCategoryEntity;
}
