import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class BuyProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  product_id: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  count: number;
}
