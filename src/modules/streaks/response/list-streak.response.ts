import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationRes } from 'src/common/response-class/pagination.response';
import { StreakEntity } from '../entity/streaks.entity';

export class ListStreaksResponse extends CoreApiResponse {
  @ApiProperty({ type: [StreakEntity] })
  data: StreakEntity[];

  @ApiProperty({ type: PaginationRes, example: PaginationRes })
  pagination: PaginationRes;
}
