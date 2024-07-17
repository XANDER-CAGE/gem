export interface ICreateFullStreak {
  channel_id: string;
  streak_level: number;
  badge_id: string;
  product_id: string;
  deleted_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}
export interface IFindAllFullStreak {
  total: number;
  data: ICreateFullStreak[];
}

export interface IUpdateFullStreak extends Partial<ICreateFullStreak> {}
