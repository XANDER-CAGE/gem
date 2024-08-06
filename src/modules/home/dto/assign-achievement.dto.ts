import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AssignAchievemntDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(24)
  profile_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(24)
  achievement_id: string;
}
