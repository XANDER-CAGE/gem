import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateAchievementDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  view: object;
}
