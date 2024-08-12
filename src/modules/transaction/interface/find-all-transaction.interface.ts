import {
  TransactionEntity,
  TransactionHistoryEntity,
} from '../entity/transaction.entity';

export interface IFindAllTransaction {
  total: number;
  data: TransactionEntity[];
}

export interface IFindAllHistoryTransaction {
  total: number;
  data: TransactionHistoryEntity[];
}
