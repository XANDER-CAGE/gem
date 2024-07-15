export interface ICreateProductReview {
  student_id: string;
  product_id: string;
  message?: string;
  rate: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface IFindAllProductReview {
  total: number;
  data: ICreateProductReview[];
}
export interface IUpdateProductReview extends Partial<ICreateProductReview> {}
