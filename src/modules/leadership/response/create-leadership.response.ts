import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { LeadershipEntity } from '../entities/leadership.entity';

export class CreateLeadershipResponse extends CoreApiResponse {
  @ApiProperty({ type: LeadershipEntity, example: LeadershipEntity })
  data: LeadershipEntity;
}
