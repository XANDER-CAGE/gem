import { ChannelEntity } from '../entity/channel.interface';

export interface IFindAllChannel {
  total: number;
  data: ChannelEntity[];
}
