import { PartialType } from '@nestjs/mapped-types';
import { CreateFullStreakDto } from './create-full-streak.dto';

export class UpdateFullStreakDto extends PartialType(CreateFullStreakDto) {}
