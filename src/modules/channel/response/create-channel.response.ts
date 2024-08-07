import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { ChannelEntity } from '../entity/channel.entity';

export class CreateChannelResponse extends CoreApiResponse {
  @ApiProperty({ type: ChannelEntity, example: ChannelEntity })
  data: ChannelEntity;
}
