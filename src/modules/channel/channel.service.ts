import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ChannelRepo } from './repo/channel.repo';
import { BadgeService } from '../badge/badge.service';
import {
  CreateChannelDto,
  FindAllChannelDto,
  UpdateChannelDto,
} from './dto/channel.dto';
import { IFindAll } from './interface/channel.interface';

@Injectable()
export class ChannelService {
  constructor(
    @Inject() private readonly channelRepo: ChannelRepo,
    private readonly badgeService: BadgeService,
  ) {}
  async create(createChannelDto: CreateChannelDto) {
    const { badge_id: badgeId } = createChannelDto;
    if (badgeId) {
      const badge = await this.badgeService.findOne(badgeId);
      if (!badge) throw new NotFoundException('Badge not found');
    }
    return this.channelRepo.create(createChannelDto);
  }

  async findAll(findAllChannelDto: FindAllChannelDto): Promise<IFindAll> {
    return this.channelRepo.findAll(findAllChannelDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} channel`;
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    console.log(updateChannelDto);

    return `This action updates a #${id} channel`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
