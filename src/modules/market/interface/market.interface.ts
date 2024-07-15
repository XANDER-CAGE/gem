export interface ICreateMarket {
  name: string;
  description?: string;
  background?: string; 
  avatar?: string; 
  category_id?: string;
  rating: number;
  created_at: Date;
  updated_at: Date;
}

export interface IFindAllMarkets {
  total: number;
  data: ICreateMarket[];
}

export interface IUpdateMarket extends Partial<ICreateMarket> {}
