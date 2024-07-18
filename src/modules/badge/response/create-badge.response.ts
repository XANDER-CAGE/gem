import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { BadgeEntity } from '../entity/badge.entity';

export class CreateBadgeResponse extends CoreApiResponse {
  @ApiProperty({ type: BadgeEntity, example: BadgeEntity })
  data: BadgeEntity;
}
