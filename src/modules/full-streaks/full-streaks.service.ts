import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FullStreakRepo } from './repo/full-streak.repo';
import {
  ICreateFullStreak,
  IUpdateFullStreak,
} from './entity/full-streak.interface';
import { BadgeService } from '../badge/badge.service';
import { ChannelService } from '../channel/channel.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ProductsService } from '../market-products/market-products.service';

@Injectable()
export class FullStreaksService {
  @Inject() private readonly fullStreakRepo: FullStreakRepo;
  @Inject() private readonly productService: ProductsService;
  @Inject() private readonly badgeService: BadgeService;
  @Inject() private readonly chanelService: ChannelService;

  async create(fullStreakRepo: ICreateFullStreak) {
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

  async findAll(findAllMarketsDto: PaginationDto) {
    return await this.fullStreakRepo.findAll(findAllMarketsDto);
  }

  async findOne(id: string) {
    return await this.fullStreakRepo.findOne(id);
  }

  async update(id: string, updateFullStreak: IUpdateFullStreak) {
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

  async remove(id: string) {
    return await this.fullStreakRepo.deleteOne(id);
  }
}