import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationRes } from 'src/common/response-class/pagination.response';
import { StudentProfileEntity } from 'src/modules/student-profiles/entity/student-profile.entity';
import { TransactionEntity } from 'src/modules/transaction/entity/transaction.entity';



@ApiExtraModels(StudentProfileEntity, TransactionEntity)
export class ListOfLeadership extends CoreApiResponse {
  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(StudentProfileEntity) },
        { $ref: getSchemaPath(TransactionEntity) },
      ],
    },
  })
  data: (StudentProfileEntity | TransactionEntity)[];
  @ApiProperty({ type: PaginationRes, example: PaginationRes })
  pagination: PaginationRes;
}
