export interface ICreateStreak {
  channel_id: string;
  streak_day: number;
  streak_reward: number;
  is_last: boolean;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export interface IFindAllStreaks {
  total: number;
  data: ICreateStreak[];
}
export interface IUpdateStreak extends Partial<ICreateStreak> {}
