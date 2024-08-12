import { ApiProperty } from '@nestjs/swagger';

export class AchievementEntity {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  view: object;
}
