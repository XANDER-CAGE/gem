import { ChannelEntity } from '../entity/channel.entity';

export interface IFindAllChannel {
  total: number;
  data: ChannelEntity[];
}

export interface IAssignChannelArg {
  progress?: number;
  channel_id: string;
  profile_id: string;
  streak_id?: string;
  is_done: boolean;
}

export interface IUpdateRelationToProfile {
  progress?: number;
  is_done?: boolean;
  relationId: string;
}
