import { ApiProperty } from '@nestjs/swagger';

export class MarketCategoryEntity {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  background?: string;
  @ApiProperty()
  avatar?: string;
  @ApiProperty()
  created_at?: Date;
  @ApiProperty()
  updated_at?: Date;
}

