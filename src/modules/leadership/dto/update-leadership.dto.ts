import { PartialType } from '@nestjs/swagger';
import { CreateLeadershipDto } from './create-leadership.dto';

export class UpdateLeadershipDto extends PartialType(CreateLeadershipDto) {}
