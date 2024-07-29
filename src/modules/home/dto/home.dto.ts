import { ApiProperty } from '@nestjs/swagger';
import { TopListTypeEnum } from '../enum/top-list.enum';
import { IsEnum, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

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
