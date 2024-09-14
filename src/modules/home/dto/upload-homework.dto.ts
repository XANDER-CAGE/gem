import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UploadHomeworkDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(24)
  file_id: string;
}
