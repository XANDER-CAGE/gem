import { StudentProfileEntity } from '../entity/student-profile.entity';

export interface IFindAllStudentProfile {
  total: number;
  data: StudentProfileEntity[];
}
