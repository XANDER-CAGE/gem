import { BadgeEntity } from '../entity/badge.entity';

export interface IFindAllBadge {
  total: number;
  data: BadgeEntity[];
}
