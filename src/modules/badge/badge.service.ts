import { Inject, Injectable } from '@nestjs/common';
import { BadgeRepo } from './repo/badge.repo';
import { CreateBadgeDto, UpdateBadgeDto } from './dto/badge.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IFindAllBadge } from './entity/badge.entity';

@Injectable()
export class BadgeService {
  constructor(@Inject() private readonly badgeRepo: BadgeRepo) {}

  async create(createChannelDto: CreateBadgeDto) {
    return this.badgeRepo.create(createChannelDto);
  }

  async findAll(findAllChannelDto: PaginationDto): Promise<IFindAllBadge> {
    return this.badgeRepo.findAll(findAllChannelDto);
  }

  async findOne(id: string) {
    return await this.badgeRepo.findOne(id);
  }

  async update(id: string, updateChannelDto: UpdateBadgeDto) {
    return this.badgeRepo.update(id, updateChannelDto);
  }

  async remove(id: string) {
    await this.badgeRepo.delete(id);
  }
}
