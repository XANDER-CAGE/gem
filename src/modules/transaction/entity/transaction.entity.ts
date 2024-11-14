import { ApiProperty } from '@nestjs/swagger';

export class TransactionEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  total_gem: number;
  @ApiProperty()
  created_at: Date;
}

export class TransactionListEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  product_id: string;
  @ApiProperty()
  profile_id: string;
  @ApiProperty()
  total_gem: number;
  @ApiProperty()
  status: string;
  @ApiProperty()
  created_at: Date;
}
