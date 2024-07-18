import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { MarketEntity } from '../entity/market.entity';

export class CreateMarketResponse extends CoreApiResponse {
  @ApiProperty({ type: MarketEntity, example: MarketEntity })
  data: MarketEntity;
}
