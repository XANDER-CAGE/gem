import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { FileEntity } from 'src/common/entity/file.entity';

export class CreateAchievementDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: FileEntity })
  @IsNotEmpty()
  @IsObject()
  view: FileEntity;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}
