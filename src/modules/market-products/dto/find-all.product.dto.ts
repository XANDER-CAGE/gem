import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FindAllProductsDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  market_id?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;
}

export class FindAllCategoriesDto extends PaginationDto {}
