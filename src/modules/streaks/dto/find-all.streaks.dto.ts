import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FindAllStreaksDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  channel_id?: string;
}
