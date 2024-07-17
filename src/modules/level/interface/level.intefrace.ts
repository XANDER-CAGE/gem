export interface ICreateLevel {
  id?: string;
  name: string;
  level: number;
  reward_point: number;
  badge_id?: string;
  free_gem: number;
  deleted_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}
export interface IFindAllLevel {
  total: number;
  data: ICreateLevel[];
}

export interface IUpdateLevel extends Partial<ICreateLevel> {}
