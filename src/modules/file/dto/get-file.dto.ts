import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetFileDto {
  @ApiProperty()
  @IsNotEmpty()
  fileId: string;
}
