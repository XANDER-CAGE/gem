import { Injectable, NotFoundException } from '@nestjs/common';
import { StreaksRepo } from './repo/streaks.repo';
import { CreateStreakDto } from './dto/create-streaks.dto';
import { UpdateStreakDto } from './dto/update-streaks.dto';
import { StreakEntity } from './entity/streaks.entity';
import { ChannelService } from '../channel/channel.service';
import { InjectConnection } from 'nest-knexjs';
import { FullStreaksService } from '../full-streaks/full-streaks.service';
import { ChannelEntity } from '../channel/entity/channel.entity';
import { FindAllStreaksDto } from './dto/find-all.streaks.dto';

@Injectable()
export class StreaksService {
  constructor(
    private readonly streakRepo: StreaksRepo,
    private readonly channelService: ChannelService,
    private readonly fullStreakService: FullStreaksService,
    @InjectConnection() private readonly knex = this.knex,
  ) {}

  async create(createStreak: CreateStreakDto) {
    const { channel_id } = createStreak;
    const channel = await this.channelService.findOne(channel_id);
    if (!channel) {
      throw new NotFoundException('This chanel does not exist');
    }

    return this.streakRepo.create(createStreak);
  }

  async findAll(dto: FindAllStreaksDto) {
    return await this.streakRepo.findAll(dto);
  }

  async findOne(id: string): Promise<StreakEntity> {
    return await this.streakRepo.findOne(id);
  }

  async findOneByChannelId(
    channelId: string,
    level: number,
    knex = this.knex,
  ): Promise<StreakEntity> {
    return await this.streakRepo.findOneByChannelId(channelId, level, knex);
  }

  async update(id: string, updateStreak: UpdateStreakDto) {
    const { channel_id } = updateStreak;
    const chanelExist = await this.streakRepo.channelExists(channel_id);
    if (!chanelExist) {
      throw new NotFoundException('This chanel does not exist');
    }

    return this.streakRepo.update(id, updateStreak);
  }

  async remove() {
    return await this.streakRepo.deleteOne();
  }

  async calculateStreak(
    channel: ChannelEntity,
    profileId: string,
    knex = this.knex,
  ) {
    const lastFailedChannel = await this.channelService.getLastUnderdoneChannel(
      profileId,
      channel.id,
      knex,
    );
    const lastFullStreak = await this.fullStreakService.getLastFullStreak(
      profileId,
      channel.id,
      knex,
    );
    if (lastFullStreak?.is_last) return null;
    let startStreakDate: Date;
    if (lastFailedChannel && lastFullStreak) {
      startStreakDate =
        new Date(lastFullStreak.joined_at) >
        new Date(lastFailedChannel.created_at)
          ? new Date(lastFullStreak.joined_at)
          : new Date(lastFailedChannel.created_at);
    } else {
      startStreakDate = lastFailedChannel
        ? lastFailedChannel.created_at
        : lastFullStreak
          ? lastFullStreak.joined_at
          : new Date('1970');
    }
    const successChannelCount = await this.channelService.countSuccessChannel(
      profileId,
      channel.id,
      new Date(startStreakDate),
      knex,
    );
    const streak = await this.findOneByChannelId(
      channel.id,
      successChannelCount + 1,
      knex,
    );
    return streak;
  }
}
