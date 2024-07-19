import { ApiProperty } from "@nestjs/swagger";
import { CoreApiResponse } from "src/common/response-class/core-api.response";

export class CreateMarketResponse extends CoreApiResponse {
  @ApiProperty({ type: Object, example: null })
  data: ;
}