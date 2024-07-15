export interface ICreateMarketCategory {
  name: string;
  description?: string;
  background?: string; 
  avatar?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IFindAllCategoriesMarkets {
  total: number;
  data: ICreateMarketCategory[];
}
export interface IUpdateMarketCategory extends Partial<ICreateMarketCategory> {}
