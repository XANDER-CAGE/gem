import { ApiProperty, PartialType } from '@nestjs/swagger';

export class ICreateMarketCategory {
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

export class IFindAllCategoriesMarkets {
  total: number;
  data: ICreateMarketCategory[];
}
export class IUpdateMarketCategory extends PartialType(ICreateMarketCategory) {}
