import { ApiProperty } from '@nestjs/swagger';

export class FileEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  type: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  size: number;
  @ApiProperty()
  bucket_name: string;
}
