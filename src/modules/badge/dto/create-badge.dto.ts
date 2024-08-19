import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBadgeDto {
  @ApiProperty({
    example: {
      url: 'https://www.girlscoutshop.com/site/Product_Images/61225_main-01.default.jpg?resizeid=22&resizeh=1200&resizew=1200',
    },
  })
  @IsNotEmpty()
  @IsObject()
  view: object;

  @ApiProperty({ example: 'Conqueror' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Given when students conquer other faculty' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 10.23 })
  @IsNumber()
  @IsNotEmpty()
  reward_gem: number;

  @ApiProperty({ example: '66af89a7bc128cb8a8b93bd3' })
  @IsString()
  @IsNotEmpty()
  achievement_id: string;

  @ApiPropertyOptional({ example: 3 })
  @IsNumber()
  @IsNotEmpty()
  progress: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  level: number;
}
