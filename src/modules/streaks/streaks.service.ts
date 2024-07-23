import { Injectable, NotFoundException } from '@nestjs/common';
import { StreaksRepo } from './repo/streaks.repo';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateStreakDto } from './dto/create-streaks.dto';
import { UpdateStreakDto } from './dto/update-streaks.dto';
import { StreakEntity } from './entity/streaks.entity';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { ChannelService } from '../channel/channel.service';

@Injectable()
export class StreaksService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly streakRepo: StreaksRepo,
    private readonly channelService: ChannelService,
  ) {}

  async create(createStreak: CreateStreakDto) {
    const { channel_id } = createStreak;
    const channel = await this.channelService.findOne(channel_id);
    if (!channel) {
      throw new NotFoundException('This chanel does not exist');
    }

    return this.streakRepo.create(createStreak);
  }

  async findAll(findAllMarketsDto: PaginationDto) {
    return await this.streakRepo.findAll(findAllMarketsDto);
  }

  async findOne(id: string): Promise<StreakEntity> {
    return await this.streakRepo.findOne(id);
  }

  async findOneByChannelId(
    channelId: string,
    knex = this.knex,
  ): Promise<StreakEntity> {
    return await this.streakRepo.findOneByChannelId(channelId, knex);
  }

  async update(id: string, updateStreak: UpdateStreakDto) {
    const { channel_id } = updateStreak;
    const chanelExist = await this.streakRepo.channelExists(channel_id);
    if (!chanelExist) {
      throw new NotFoundException('This chanel does not exist');
    }

    return this.streakRepo.update(id, updateStreak);
  }

  async remove(id: string) {
    return await this.streakRepo.deleteOne(id);
  }
}
