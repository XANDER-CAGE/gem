import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationRes } from 'src/common/response-class/pagination.response';
import { ChannelEntity } from '../entity/channel.entity';

export class ListChannelResponse extends CoreApiResponse {
  @ApiProperty({ type: [ChannelEntity] })
  data: ChannelEntity[];

  @ApiProperty({ type: PaginationRes, example: PaginationRes })
  pagination: PaginationRes;
}
