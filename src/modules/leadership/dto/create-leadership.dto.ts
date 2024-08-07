import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TopListTypeEnum } from '../enum/leadership.enum';

export class CreateLeadershipDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  id?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  profile_id: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  last_position_by_gem: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  last_position_by_earning: number;
}

export class LimitWithTopListDto {
  @ApiProperty({ example: 0 })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  limit: number;

  @ApiProperty({
    example: TopListTypeEnum.STUDENT_TOP_BY_GEM,
    enum: TopListTypeEnum,
  })
  @IsEnum(TopListTypeEnum)
  listType: TopListTypeEnum;
}

export class LimitWithTopListBySchoolDto {
  @ApiProperty({ example: 0 })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  limit: number;

  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  school_id: string;

  @ApiProperty({
    example: TopListTypeEnum.STUDENT_TOP_BY_GEM,
    enum: TopListTypeEnum,
  })
  @IsEnum(TopListTypeEnum)
  listType: TopListTypeEnum;
}
