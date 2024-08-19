import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FindAllBadgesDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  achievement_id?: string;
}
