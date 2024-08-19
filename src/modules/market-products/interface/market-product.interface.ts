import { ProductEntity } from '../entity/product.interface';

export interface IFindAllProduct {
  total: number;
  data: ProductEntity[];
}
