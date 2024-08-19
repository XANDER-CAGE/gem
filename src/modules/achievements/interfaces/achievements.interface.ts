import { AchievementEntity } from '../entities/achievement.entity';

export interface IFindAllAchievements {
  total: number;
  data: AchievementEntity[];
}
