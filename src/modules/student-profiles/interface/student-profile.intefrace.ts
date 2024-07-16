export interface ICreateStudentProfile {
  avatar?: Record<string, any>;
  level: number;
  gem: number;
  created_at?: Date;
  updated_at?: Date;
}
export interface IFindAllStudentProfile {
  total: number;
  data: ICreateStudentProfile[];
}

export interface IUpdateStudentProfile extends Partial<ICreateStudentProfile> {}
