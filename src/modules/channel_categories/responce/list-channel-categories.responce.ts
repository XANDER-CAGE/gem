import { ApiProperty } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationRes } from 'src/common/response-class/pagination.response';
import { ChannelCategoriesEntity } from '../entity/channel-categories.entity';

export class ListChannelCategoriesResponse extends CoreApiResponse {
  @ApiProperty({ type: [ChannelCategoriesEntity] })
  data: ChannelCategoriesEntity[];

  @ApiProperty({ type: PaginationRes, example: PaginationRes })
  pagination: PaginationRes;
}
