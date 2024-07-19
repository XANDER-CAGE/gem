import { PartialType } from '@nestjs/swagger';
import { CreateStreakDto } from './create-streaks.dto';

export class UpdateStreakDto extends PartialType(CreateStreakDto) {}
