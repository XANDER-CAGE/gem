import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateBadgeDto {
  @ApiProperty({
    default: {
      url: 'https://www.girlscoutshop.com/site/Product_Images/61225_main-01.default.jpg?resizeid=22&resizeh=1200&resizew=1200',
    },
  })
  @IsNotEmpty()
  @IsObject()
  view: object;

  @ApiProperty({ default: 'Conqueror' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ default: 'Given when students conquer other faculty' })
  @IsString()
  @IsOptional()
  description?: string;

  // @ApiPropertyOptional()
  // @IsString()
  // @IsOptional()
  // course_id?: string;
}
