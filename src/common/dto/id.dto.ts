import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class IdDto {
  @ApiProperty({ default: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  id?: string;
}
