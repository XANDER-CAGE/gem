import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { StreaksRepo } from './repo/streaks.repo';
import { ChannelService } from '../channel/channel.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateStreakDto } from './dto/create-streaks.dto';
import { UpdateStreakDto } from './dto/update-streaks.dto';

@Injectable()
export class StreaksService {
  @Inject() private readonly streakRepo: StreaksRepo;
  @Inject() private readonly chanelService: ChannelService;

  async create(createStreak: CreateStreakDto) {
    const { channel_id } = createStreak;
    const chanelExist = await this.chanelService.findOne(channel_id);
    if (!chanelExist) {
      throw new NotFoundException('This chanel does not exist');
    }

    return this.streakRepo.create(createStreak);
  }

  findAll(findAllMarketsDto: PaginationDto) {
    return this.streakRepo.findAll(findAllMarketsDto);
  }

  findOne(id: string) {
    return this.streakRepo.findOne(id);
  }

  async update(id: string, updateStreak: UpdateStreakDto) {
    const { channel_id } = updateStreak;
    const chanelExist = await this.chanelService.findOne(channel_id);
    if (!chanelExist) {
      throw new NotFoundException('This chanel does not exist');
    }

    return this.streakRepo.update(id, updateStreak);
  }

  remove(id: string) {
    return this.streakRepo.deleteOne(id);
  }
}
