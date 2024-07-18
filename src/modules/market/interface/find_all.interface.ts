import { MarketEntity } from '../entity/market.entity';

export interface IFindAllMarkets {
  total: number;
  data: MarketEntity[];
}
