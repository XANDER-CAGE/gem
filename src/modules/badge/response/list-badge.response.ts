import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationRes } from 'src/common/response-class/pagination.response';
import { BadgeEntity } from '../entity/badge.entity';

export class ListBadgeResponse extends CoreApiResponse {
  @ApiProperty({ type: [BadgeEntity] })
  data: BadgeEntity[];

  @ApiProperty({ type: PaginationRes, example: PaginationRes })
  pagination: PaginationRes;
}
