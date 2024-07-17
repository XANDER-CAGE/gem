import { ApiProperty } from "@nestjs/swagger";

export class IProduct {
  @ApiProperty()
  market_id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  avatar?: string;
  @ApiProperty()
  type?: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  remaining_count: number;
  @ApiProperty()
  deleted_at?: Date;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}

export class IFindAllProduct {
  total: number;
  data: IProduct[];
}
