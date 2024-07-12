export interface ICreateMarket {
  name: string;
  description?: string;
  background?: Record<string, any>;
  avatar?: Record<string, any>;
  category_id?: string;
  rating: number;
  created_at: Date;
  updated_at: Date;
}
export interface IUpdateMarket extends Partial<ICreateMarket>{}
