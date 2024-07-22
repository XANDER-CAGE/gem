import { PartialType } from '@nestjs/swagger';
import { CreateChannelCategoriesDto } from './channel-categories-create.dto';

export class UpdateChannelCategoriesDto extends PartialType(
  CreateChannelCategoriesDto,
) {}
