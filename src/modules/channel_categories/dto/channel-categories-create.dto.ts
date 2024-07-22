import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateChannelCategoriesDto {
  @ApiProperty({ example: 'Attendance' })
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  name: string;
}
