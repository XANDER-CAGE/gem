import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({ example: '66af89a7bc128cb8a8b93bd3' })
  @IsString()
  @IsNotEmpty()
  product_id: string;
}
