import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { AchievementEntity } from '../entities/achievement.entity';

export class CreateAchievementResponse extends CoreApiResponse {
  @ApiProperty({ type: AchievementEntity, example: AchievementEntity })
  data: AchievementEntity;
}
