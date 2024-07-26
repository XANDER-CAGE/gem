import { Injectable } from '@nestjs/common';
import { BadgeRepo } from './repo/badge.repo';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IFindAllBadge } from './interface/find_all.interface';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';

@Injectable()
export class BadgeService {
  constructor(
    private readonly badgeRepo: BadgeRepo,
    @InjectConnection() private readonly knex: Knex,
  ) {}

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

  async connectToProfile(profileId: string, badgeId: string, knex = this.knex) {
    const connection = await this.badgeRepo.findConnectionToProfile(
      profileId,
      badgeId,
      knex,
    );
    if (connection) return connection;
    return await this.badgeRepo.connectToProfile(profileId, badgeId, knex);
  }
}
