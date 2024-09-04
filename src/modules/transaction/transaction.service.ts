import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepo } from './repo/transaction.repo';
import { StudentProfilesService } from '../student-profiles/student-profiles.service';
import { TransactionEntity } from './entity/transaction.entity';
import { ProductsService } from '../market-products/market-products.service';
import {
  PaginationDto,
  TransactionListDto,
} from 'src/common/dto/pagination.dto';
import { IFindAllTransaction } from './interface/find-all-transaction.interface';
import { CreateEarningDto } from './dto/create-earning-transaction.dto';
import { CreateSpendingDto } from './dto/create-spending-transaction.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { CreateManualTransactionDto } from './dto/create.transaction.dto';
import { LevelService } from '../level/level.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly transactionRepo: TransactionRepo,
    private readonly profileService: StudentProfilesService,
    private readonly productService: ProductsService,
    private readonly levelService: LevelService,
  ) {}

  async createManual(
    dto: CreateManualTransactionDto,
    userId: string,
    knex = this.knex,
  ) {
    const profile = await this.profileService.findOne(dto.profile_id);
    if (!profile) throw new NotFoundException('Profile not found');
    await knex.transaction(async (trx) => {
      await this.transactionRepo.createManual(dto, userId, trx);
      await this.profileService.update(
        profile.id,
        {
          gem: profile.gem + dto.amount,
        },
        trx,
      );
      const sum = await this.transactionRepo.sumAllEarning(dto.profile_id, trx);
      await this.levelService.connectToProfile(dto.profile_id, sum, trx);
    });
  }

  async createEarning(
    dto: CreateEarningDto,
    knex = this.knex,
  ): Promise<TransactionEntity> {
    return await this.transactionRepo.createEarning(dto, knex);
  }

  async createSpending(
    dto: CreateSpendingDto,
    knex = this.knex,
  ): Promise<TransactionEntity> {
    let totalGem = 0;
    const profile = await this.profileService.findOne(dto.profile_id);
    if (!profile) throw new NotFoundException('Profile not found');
    const product = await this.productService.findOne(dto.product_id);
    if (!product) throw new NotFoundException('Channel not found');
    totalGem += product.price * dto.count;
    return totalGem
      ? await this.transactionRepo.createSpending(
          {
            ...dto,
            total_gem: -totalGem,
          },
          knex,
        )
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

  // async listTopEarning(limit: number, profile_id: string) {
  //   return await this.transactionRepo.listTopEarning(limit, profile_id);
  // }

  async transactionHistory(dto: TransactionListDto, profileId: string) {
    return await this.transactionRepo.transactionHistory(dto, profileId);
  }
  // async update(id: string, dto: any) {
  //   return await this.transactionRepo.update(id, dto);
  // }

  // async remove(id: string) {
  //   return await this.transactionRepo.delete(id);
  // }
}
