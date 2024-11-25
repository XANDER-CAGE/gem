import { Injectable } from '@nestjs/common';
import { BadgeRepo } from './repo/badge.repo';
import { IFindAllBadge } from './interface/find_all.interface';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { FindAllBadgesDto } from './dto/find-all.badge.dto';
import { BadgeEntity } from './entity/badge.entity';

@Injectable()
export class BadgeService {
  constructor(
    private readonly badgeRepo: BadgeRepo,
    @InjectConnection() private readonly knex: Knex,
  ) {}

  async create(dto: CreateBadgeDto) {
    return this.badgeRepo.create(dto);
  }

  async findAll(dto: FindAllBadgesDto): Promise<IFindAllBadge> {
    return this.badgeRepo.findAll(dto);
  }

  async findOne(id: string) {
    return await this.badgeRepo.findOne(id);
  }

  async update(id: string, dto: UpdateBadgeDto) {
    return this.badgeRepo.update(id, dto);
  }

  async remove(id: string) {
    await this.badgeRepo.delete(id);
  }

  async connectToProfile(
    profileId: string,
    badgeId: string,
    progress: number,
    knex = this.knex,
  ) {
    return await this.badgeRepo.connectToProfile(
      profileId,
      badgeId,
      progress,
      knex,
    );
  }

  async getUnderdoneBadge(profileId: string, achievementId: string) {
    return await this.badgeRepo.getUnderdoneBadge(profileId, achievementId);
  }

  async getBadgeByLevel(
    level: number,
    achievementId: string,
    knex = this.knex,
  ) {
    return await this.badgeRepo.getByLevel(level, achievementId, knex);
  }

  async updateConnection(
    column: string,
    value: any,
    connectionId: string,
    knex = this.knex,
  ) {
    return this.badgeRepo.updateConnection(column, value, connectionId, knex);
  }

  async checkForPopUp(profileId: string): Promise<BadgeEntity[]> {
    const badges = await this.badgeRepo.checkForPopUp(profileId);
    for (const badge of badges) {
      await this.updateConnection('is_shown', true, badge.connection_id);
      delete badge.connection_id;
    }
    return badges;
  }

  async getByAchievement(achievementId: string, knex = this.knex) {
    return await this.badgeRepo.getByAchievement(achievementId, knex);
  }

  async getUnderdoneAssignment(
    profileId: string,
    assignmentCount: number,
    knex = this.knex,
  ) {
    return await this.badgeRepo.getUnderdoneAssignment(
      profileId,
      assignmentCount,
      knex,
    );
  }

  async assignmentCount(profileId: string, knex = this.knex) {
    return await this.badgeRepo.assignmentCount(profileId, knex);
  }

  async userHaveTheBadge(profileId: string, badgeId: string, knex = this.knex) {
    return this.badgeRepo.userHaveTheBadge(profileId, badgeId, knex);
  }
}
