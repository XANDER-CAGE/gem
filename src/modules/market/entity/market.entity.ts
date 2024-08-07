import { ApiProperty } from '@nestjs/swagger';

export class MarketEntity {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  background?: object;
  @ApiProperty()
  avatar?: object;
  @ApiProperty()
  category_id?: string;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}
