import { StudentProfileEntity } from 'src/modules/student-profiles/entity/student-profile.entity';
import { TransactionEntity } from 'src/modules/transaction/entity/transaction.entity';

export interface IFindAllStudentTopByGem {
  total: number;
  data: StudentProfileEntity[];
}

export interface IFindAllStudentTopByEarning {
  total: number;
  data: TransactionEntity[];
}
