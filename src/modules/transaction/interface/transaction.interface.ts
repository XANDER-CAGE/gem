export interface IEarning {
  id: string;
  profile_id: string;
  channel_id?: string;
  streak_id?: string;
  total_earned: number;
  deleted_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ISpending {
  id: string;
  market_product_id: string;
  count: number;
  profile_id: string;
  total_price: number;
  deleted_at: Date;
  created_at: Date;
  updated_at: Date;
}
