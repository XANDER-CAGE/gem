import { Injectable, NotFoundException } from '@nestjs/common';
import { FullStreakRepo } from './repo/full-streak.repo';
import { BadgeService } from '../badge/badge.service';
import { ChannelService } from '../channel/channel.service';
import { ProductsService } from '../market-products/market-products.service';
import { CreateFullStreakDto } from './dto/create-full-streaks.dto';
import { UpdateFullStreakDto } from './dto/update-full-streaks.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { FindAllFullStreaksDto } from './dto/find-all.full-streak';

@Injectable()
export class FullStreaksService {
  constructor(
    private readonly fullStreakRepo: FullStreakRepo,
    private readonly productService: ProductsService,
    private readonly badgeService: BadgeService,
    private readonly chanelService: ChannelService,
    @InjectConnection() private readonly knex: Knex,
  ) {}

  async create(fullStreakRepo: CreateFullStreakDto) {
    const { badge_id, channel_id, product_id } = fullStreakRepo;
    if (badge_id) {
      const badgeExist = await this.badgeService.findOne(badge_id);
      if (!badgeExist) {
        throw new NotFoundException('This badge does not exist');
      }
    }
    if (product_id) {
      const productExist = await this.productService.findOne(product_id);
      if (!productExist) {
        throw new NotFoundException('This product does not exist');
      }
    }
    const chanelExist = await this.chanelService.findOne(channel_id);
    if (!chanelExist) {
      throw new NotFoundException('This chanel does not exist');
    }

    return this.fullStreakRepo.create(fullStreakRepo);
  }

  async findAll(dto: FindAllFullStreaksDto) {
    return await this.fullStreakRepo.findAll(dto);
  }

  async findOne(id: string) {
    return await this.fullStreakRepo.findOne(id);
  }

  async update(id: string, updateFullStreak: UpdateFullStreakDto) {
    const { badge_id, channel_id, product_id } = updateFullStreak;
    if (badge_id) {
      const badgeExist = await this.badgeService.findOne(badge_id);
      if (!badgeExist) {
        throw new NotFoundException('This badge does not exist');
      }
    }
    if (product_id) {
      const productExist = await this.productService.findOne(product_id);
      if (!productExist) {
        throw new NotFoundException('This product does not exist');
      }
    }
    const chanelExist = await this.chanelService.findOne(channel_id);
    if (!chanelExist) {
      throw new NotFoundException('This chanel does not exist');
    }

    return this.fullStreakRepo.update(id, updateFullStreak);
  }

  async remove() {
    return await this.fullStreakRepo.deleteOne();
  }

  async getLastFullStreak(
    profileId: string,
    channelId: string,
    knex = this.knex,
  ) {
    return await this.fullStreakRepo.getLastFullStreak(
      profileId,
      channelId,
      knex,
    );
  }

  async assignFullStreak(
    profileId: string,
    channelId: string,
    knex = this.knex,
  ) {
    const lastFullStreak = await this.fullStreakRepo.getLastFullStreak(
      profileId,
      channelId,
      knex,
    );
    const nextFullStreak = await this.fullStreakRepo.getOneByLevel(
      channelId,
      lastFullStreak?.level + 1 || 1,
      knex,
    );
    if (!nextFullStreak) return null;
    await this.fullStreakRepo.assignFullStreak(
      profileId,
      nextFullStreak.id,
      knex,
    );
    if (nextFullStreak.product_id) {
      await this.productService.connectToProfile(
        profileId,
        nextFullStreak.product_id,
        knex,
      );
    }
    return nextFullStreak;
  }

  async checkForPopUp(profileId: string) {
    const fullStreaks = await this.fullStreakRepo.checkForPopUp(profileId);
    for (const fullStreak of fullStreaks) {
      await this.fullStreakRepo.updateConnection(
        'is_shown',
        true,
        fullStreak.connection_id,
      );
      delete fullStreak.connection_id;
    }
    return fullStreaks;
  }
}
