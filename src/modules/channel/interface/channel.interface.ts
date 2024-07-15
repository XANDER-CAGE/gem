export interface IChannel {
  id: string;
  name: string;
  desctription?: string;
  reward_gem: number;
  badge_id?: string;
  deleted_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IFindAllChannel {
  total: number;
  data: IChannel[];
}
