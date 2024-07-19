import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { LevelEntity } from '../entity/level.entity';

export class CreateLevelResponse extends CoreApiResponse {
  @ApiProperty({ type: LevelEntity, example: LevelEntity })
  data: LevelEntity;
}
