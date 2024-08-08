import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-market-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
