import { PartialType } from '@nestjs/swagger';
import { CreateChannelDto } from './channel-create.dto';

export class UpdateChannelDto extends PartialType(CreateChannelDto) {}
