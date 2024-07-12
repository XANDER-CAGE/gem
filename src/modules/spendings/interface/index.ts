export interface ICreateSpending {
  market_product_id: string;
  count: number;
  student_id: string;
  total_price: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface IUpdateSpending extends Partial<ICreateSpending> {}
