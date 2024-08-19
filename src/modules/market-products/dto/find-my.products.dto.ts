import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FindMyProductsDto extends PaginationDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  profile_id: string;
}
