import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FindAllProductReviewDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  product_id?: string;
}
