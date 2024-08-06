import { BadgeEntity } from '../entity/badge.entity';

export interface IFindUnderdoneBadge {
  user_progress: number;
  connection_id: string;
  badge: BadgeEntity;
}
