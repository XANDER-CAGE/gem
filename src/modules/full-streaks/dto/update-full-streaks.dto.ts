import { PartialType } from '@nestjs/swagger';
import { CreateFullStreakDto } from './create-full-streaks.dto';

export class UpdateFullStreakDto extends PartialType(CreateFullStreakDto) {}
