import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { ChannelCategoriesEntity } from '../entity/channel-categories.entity';

export class CreateChannelCategoriesResponse extends CoreApiResponse {
  @ApiProperty({
    type: ChannelCategoriesEntity,
    example: ChannelCategoriesEntity,
  })
  data: ChannelCategoriesEntity;
}
