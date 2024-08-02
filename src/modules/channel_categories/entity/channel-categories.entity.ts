import { ApiProperty } from '@nestjs/swagger';

export class ChannelCategoriesEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  is_serial: boolean;
  @ApiProperty()
  deleted_at: Date;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}
