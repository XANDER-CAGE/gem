import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationRes } from 'src/common/response-class/pagination.response';
import { FullStreakEntity } from '../entity/full-streak.entity';

export class ListFullStreakResponse extends CoreApiResponse {
  @ApiProperty({ type: [FullStreakEntity] })
  data: FullStreakEntity[];

  @ApiProperty({ type: PaginationRes, example: PaginationRes })
  pagination: PaginationRes;
}
