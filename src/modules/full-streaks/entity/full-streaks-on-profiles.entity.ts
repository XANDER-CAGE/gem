import { ApiProperty } from '@nestjs/swagger';
import { FullStreakEntity } from './full-streak.entity';

export class FullStreaksOnProfiles extends FullStreakEntity {
  @ApiProperty()
  joined_at: Date;
}
