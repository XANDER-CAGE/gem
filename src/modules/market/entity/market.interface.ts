import { ApiProperty, PartialType } from '@nestjs/swagger';

export class ICreateMarket {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  background?: string;
  @ApiProperty()
  avatar?: string;
  @ApiProperty()
  category_id?: string;
  @ApiProperty()
  rating: number;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}

export class IFindAllMarkets {
  total: number;
  data: ICreateMarket[];
}

export class IUpdateMarket extends PartialType(ICreateMarket) {}
