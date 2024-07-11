import { PartialType } from '@nestjs/mapped-types';
import { CreateMarketCategoryDto } from './create-market-category.dto';

export class UpdateMarketCategoryDto extends PartialType(CreateMarketCategoryDto) {}
