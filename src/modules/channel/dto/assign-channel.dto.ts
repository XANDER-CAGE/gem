import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AssignChannelDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(24)
  student_profile_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(24)
  channel_id: string;
}
