import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationRes } from 'src/common/response-class/pagination.response';
import { RankedStudentEntity } from '../entity/home.entity';

export class ListOfLeadership extends CoreApiResponse {
  @ApiProperty({ type: [RankedStudentEntity] })
  data: RankedStudentEntity[];
  @ApiProperty({ type: PaginationRes, example: PaginationRes })
  pagination: PaginationRes;
}
