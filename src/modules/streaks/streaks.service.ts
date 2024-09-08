import { Injectable } from '@nestjs/common';
import { StreaksRepo } from './repo/streaks.repo';
import { CreateStreakDto } from './dto/create-streaks.dto';
import { UpdateStreakDto } from './dto/update-streaks.dto';
import { StreakEntity } from './entity/streaks.entity';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class StreaksService {
  constructor(
    private readonly streakRepo: StreaksRepo,
    @InjectConnection() private readonly knex: Knex,
  ) {}

  async create(createStreak: CreateStreakDto) {
    return this.streakRepo.create(createStreak);
  }

  async findAll(dto: PaginationDto) {
    return await this.streakRepo.findAll(dto);
  }

  async findOne(id: string): Promise<StreakEntity> {
    return await this.streakRepo.findOne(id);
  }

  async findOneByLevel(level: number, knex = this.knex): Promise<StreakEntity> {
    return await this.streakRepo.findOneByLevel(level, knex);
  }

  async update(id: string, updateStreak: UpdateStreakDto) {
    return this.streakRepo.update(id, updateStreak);
  }

  async remove() {
    return await this.streakRepo.deleteOne();
  }

  async myStreak(profileId: string) {
    const date = await this.streakRepo.findStreakStartDate(profileId);
    const successCount = await this.streakRepo.countSuccess(profileId, date);
    return await this.findOneByLevel(+successCount);
  }
}
