import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationRes } from 'src/common/response-class/pagination.response';
import { AchievementEntity } from '../entities/achievement.entity';

export class ListAchievementResponse extends CoreApiResponse {
  @ApiProperty({ type: [AchievementEntity] })
  data: AchievementEntity[];

  @ApiProperty({ type: PaginationRes, example: PaginationRes })
  pagination: PaginationRes;
}
