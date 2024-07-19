import { FullStreakEntity } from '../entity/full-streak.entity';

export interface IFindAllFullStreak {
  total: number;
  data: FullStreakEntity[];
}
