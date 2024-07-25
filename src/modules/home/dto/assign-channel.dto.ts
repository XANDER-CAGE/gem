import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator';

export class AssignChannelDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(24)
  profile_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(24)
  channel_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  is_done: boolean;
}
