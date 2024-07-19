import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { FullStreakEntity } from '../entity/full-streak.entity';

export class CreateFullStreakResponse extends CoreApiResponse {
  @ApiProperty({ type: FullStreakEntity, example: FullStreakEntity })
  data: FullStreakEntity;
}
