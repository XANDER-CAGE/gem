import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationRes } from 'src/common/response-class/pagination.response';
import { LevelEntity } from '../entity/level.entity';

export class ListLevelResponse extends CoreApiResponse {
  @ApiProperty({ type: [LevelEntity] })
  data: LevelEntity[];

  @ApiProperty({ type: PaginationRes, example: PaginationRes })
  pagination: PaginationRes;
}
