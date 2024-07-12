export interface ICreateMarketCategory {
  name: string;
  description?: string;
  background?: Record<string, any>;
  avatar?: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
}

export interface IUpdateMarketCategory extends Partial<ICreateMarketCategory> {}
