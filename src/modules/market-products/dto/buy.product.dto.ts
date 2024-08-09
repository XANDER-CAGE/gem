import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BuyProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  product_id: string;
}
