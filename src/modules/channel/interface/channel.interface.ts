import { ChannelEntity } from '../entity/channel.entity';

export interface IFindAllChannel {
  total: number;
  data: ChannelEntity[];
}
