import { StreakEntity } from '../entity/streaks.entity';

export interface IFindAllStreaks {
  total: number;
  data: StreakEntity[];
}
