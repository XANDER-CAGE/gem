import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { MarketEntity } from '../entity/market.entity';
import { PaginationRes } from 'src/common/response-class/pagination.response';

export class ListMarketRes extends CoreApiResponse {
  @ApiProperty({ type: [MarketEntity] })
  data: MarketEntity[];

  @ApiProperty({ type: PaginationRes, example: PaginationRes })
  pagination: PaginationRes;
}
