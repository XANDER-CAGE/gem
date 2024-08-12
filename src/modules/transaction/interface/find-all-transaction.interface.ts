import { TransactionEntity } from '../entity/transaction.entity';

export interface IFindAllTransaction {
  total: number;
  data: TransactionEntity[];
}

export interface IFindAllHistoryTransaction {
  total: number;
  data: TransactionEntity[];
}
