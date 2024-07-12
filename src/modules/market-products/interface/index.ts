export interface ICreateMarketProduct {
  market_id: string;
  name: string;
  description?: string;
  avatar?: Record<string, any>;
  type?: string;
  price: number;
  remaining_count: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface IUpdateMarketProduct extends Partial<ICreateMarketProduct> {}
