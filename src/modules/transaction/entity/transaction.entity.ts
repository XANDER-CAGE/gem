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
