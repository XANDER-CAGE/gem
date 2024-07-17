import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { StreaksRepo } from './repo/streaks.repo';
import { ChannelService } from '../channel/channel.service';
import { ICreateStreak, IUpdateStreak } from './intefrace/streaks.interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class StreaksService {
  @Inject() private readonly streakRepo: StreaksRepo;
  @Inject() private readonly chanelService: ChannelService;

  async create(createStreak: ICreateStreak) {
    const { channel_id } = createStreak;
    const chanelExist = await this.streakRepo.findOne(channel_id);
    if (!chanelExist) {
      throw new NotFoundException('This badge does not exist');
    }

    return this.streakRepo.create(createStreak);
  }

  findAll(findAllMarketsDto: PaginationDto) {
    return this.streakRepo.findAll(findAllMarketsDto);
  }

  findOne(id: string) {
    return this.streakRepo.findOne(id);
  }

  async update(id: string, updateStreak: IUpdateStreak) {
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
