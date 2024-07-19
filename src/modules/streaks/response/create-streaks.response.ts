import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { StreakEntity } from '../entity/streaks.entity';

export class CreateStreakResponse extends CoreApiResponse {
  @ApiProperty({ type: StreakEntity, example: StreakEntity })
  data: StreakEntity;
}
