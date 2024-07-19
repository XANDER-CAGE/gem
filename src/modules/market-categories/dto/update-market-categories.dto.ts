import { PartialType } from "@nestjs/swagger";
import { CreateMarketCategoryDto } from "./create-market-categories.dto";

export class UpdateMarketCategoryDto extends PartialType(
  CreateMarketCategoryDto,
) {}
