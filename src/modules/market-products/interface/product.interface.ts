export interface IProduct {
  market_id: string;
  name: string;
  description?: string;
  avatar?: Record<string, any>;
  type?: string;
  price: number;
  remaining_count: number;
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IFindAllProduct {
  total: number;
  data: IProduct[];
}
