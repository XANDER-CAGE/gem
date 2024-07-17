import { ApiProperty } from '@nestjs/swagger';

export class IChannel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  desctription?: string;
  @ApiProperty()
  reward_gem: number;
  @ApiProperty()
  badge_id?: string;
  @ApiProperty()
  deleted_at: Date;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
}

export class IFindAllChannel {
  total: number;
  data: IChannel[];
}
