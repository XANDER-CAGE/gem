import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationRes } from 'src/common/response-class/pagination.response';
import {
  LeadershipEntity,
  RankedStudentEntity,
} from '../entities/leadership.entity';

export class ListLeadershipResponse extends CoreApiResponse {
  @ApiProperty({ type: [LeadershipEntity] })
  data: LeadershipEntity[];

  @ApiProperty({ type: PaginationRes, example: PaginationRes })
  pagination: PaginationRes;
}

export class ListOfLeadership extends CoreApiResponse {
  @ApiProperty({ type: [RankedStudentEntity] })
  data: RankedStudentEntity[];
  @ApiProperty({ type: PaginationRes, example: PaginationRes })
  pagination: PaginationRes;
}
