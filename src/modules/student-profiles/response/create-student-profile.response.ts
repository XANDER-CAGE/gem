import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { StudentProfileEntity } from '../entity/student-profile.entity';

export class CreateStudentProfileResponse extends CoreApiResponse {
  @ApiProperty({ type: StudentProfileEntity, example: StudentProfileEntity })
  data: StudentProfileEntity;
}
