export interface ICreateStudentProfile {
  id?: string;
  avatar?: string;
  level: number;
  student_id?: string;
  streak_id?: string;
  level_id?: string;
  gem: number;
  deleted_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}
export interface IFindAllStudentProfile {
  total: number;
  data: ICreateStudentProfile[];
}

export interface IUpdateStudentProfile extends Partial<ICreateStudentProfile> {}
