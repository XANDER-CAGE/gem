import { ApiProperty } from '@nestjs/swagger';
export class LeadershipEntity {
  @ApiProperty()
  id?: string;
  @ApiProperty()
  profile_id: string;
  @ApiProperty()
  last_position_by_gem: number;
  @ApiProperty()
  last_position_by_earning: number;
}
