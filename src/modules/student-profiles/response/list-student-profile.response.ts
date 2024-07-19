import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationRes } from 'src/common/response-class/pagination.response';
import { StudentProfileEntity } from '../entity/student-profile.entity';

export class ListStudentProfileResponse extends CoreApiResponse {
  @ApiProperty({ type: [StudentProfileEntity] })
  data: StudentProfileEntity[];

  @ApiProperty({ type: PaginationRes, example: PaginationRes })
  pagination: PaginationRes;
}
