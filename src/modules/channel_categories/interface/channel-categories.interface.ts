import { ChannelCategoriesEntity } from '../entity/channel-categories.entity';

export interface IFindAllChannelCategories {
  total: number;
  data: ChannelCategoriesEntity[];
}
