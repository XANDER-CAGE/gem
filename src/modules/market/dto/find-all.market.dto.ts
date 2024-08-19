import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FindAllMarketDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category_id?: string;
}
