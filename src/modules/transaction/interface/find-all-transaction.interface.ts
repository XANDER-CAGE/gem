import { TransactionEntity } from '../entity/transaction.entity';

export interface IFindAllTransaction {
  total: number;
  data: TransactionEntity[];
}
