export interface IChannelInterface {
  id: string;
  name: string;
  desctription?: string;
  reward_gem: number;
  badge_id?: string;
  deleted_at: Date;
  created_at: Date;
  updated_at: Date;
}
