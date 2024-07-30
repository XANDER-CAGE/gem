import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepo } from './repo/transaction.repo';
import { StudentProfilesService } from '../student-profiles/student-profiles.service';
import { StreaksService } from '../streaks/streaks.service';
import { TransactionEntity } from './entity/transaction.entity';
import { ProductsService } from '../market-products/market-products.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IFindAllTransaction } from './interface/find-all-transaction.interface';
import { CreateEarningDto } from './dto/create-earning-transaction.dto';
import { CreateSpendingDto } from './dto/create-spending-transaction.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { ChannelService } from '../channel/channel.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly transactionRepo: TransactionRepo,
    private readonly profileService: StudentProfilesService,
    private readonly streakService: StreaksService,
    private readonly productService: ProductsService,
    private readonly channelService: ChannelService,
  ) {}

  async createEarning(
    dto: CreateEarningDto,
    knex = this.knex,
  ): Promise<TransactionEntity> {
    let totalGem = 0;
    const profile = await this.profileService.findOne(dto.profile_id);
    if (!profile) throw new NotFoundException('Profile not found');
    const channel = await this.channelService.findOne(dto.channel_id);
    if (!channel) throw new NotFoundException('Channel not found');
    totalGem += +channel.reward_gem;
    if (dto.streak_id) {
      const streak = await this.streakService.findOne(dto.streak_id);
      if (!streak) throw new NotFoundException('Streak not found');
      totalGem += +streak.streak_reward;
    }
    return await this.transactionRepo.createEarning(
      { ...dto, total_gem: totalGem },
      knex,
    );
  }

  async createSpending(dto: CreateSpendingDto): Promise<TransactionEntity> {
    let totalGem = 0;
    const profile = await this.profileService.findOne(dto.profile_id);
    if (!profile) throw new NotFoundException('Profile not found');
    const product = await this.productService.findOne(dto.product_id);
    if (!product) throw new NotFoundException('Channel not found');
    totalGem += product.price * dto.count;
    return totalGem
      ? await this.transactionRepo.createSpending({
          ...dto,
          total_gem: totalGem,
        })
      : null;
  }

  findAll(dto: PaginationDto): Promise<IFindAllTransaction> {
    return this.transactionRepo.findAll(dto);
  }

  async findOne(id: string): Promise<TransactionEntity> {
    return await this.transactionRepo.findOne(id);
  }

  async sumAllEarning(profileId: string, knex = this.knex) {
    return await this.transactionRepo.sumAllEarning(profileId, knex);
  }

  // async update(id: string, dto: any) {
  //   return await this.transactionRepo.update(id, dto);
  // }

  // async remove(id: string) {
  //   return await this.transactionRepo.delete(id);
  // }
}
