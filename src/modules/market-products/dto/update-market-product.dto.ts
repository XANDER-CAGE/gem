import { PartialType } from '@nestjs/mapped-types';
import { CreateMarketProductDto } from './create-market-product.dto';

export class UpdateMarketProductDto extends PartialType(CreateMarketProductDto) {}
