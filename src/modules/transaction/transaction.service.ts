import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { TransactionRepo } from './repo/transaction.repo';
import { StudentProfilesService } from '../student-profiles/student-profiles.service';
import { TransactionEntity } from './entity/transaction.entity';
import { ProductsService } from '../market-products/market-products.service';
import {
  TransactionFinishedList,
  TransactionListDto,
} from 'src/common/dto/pagination.dto';
import { CreateEarningDto } from './dto/create-earning-transaction.dto';
import { CreateSpendingDto } from './dto/create-spending-transaction.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import {
  CreateManualTransactionDto,
  TransactionUpdateStatus,
} from './dto/create.transaction.dto';
import { LevelService } from '../level/level.service';
import { TransactionStatusEnum } from './enum/transaction.history.enum';

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
    const student = await this.profileService.getStudentByColumn(
      'uid',
      dto.uid,
    );
    if (!student) throw new NotFoundException('Student not found');
    if (student.is_blocked) {
      throw new NotAcceptableException('Student is blocked');
    }
    const profile = await this.profileService.getProfileByColumn(
      'student_id',
      student.id,
    );
    if (!profile) {
      throw new NotFoundException('Student not registered in gamification');
    }
    let totalGem = dto.amount;
    await knex.transaction(async (trx) => {
      await this.transactionRepo.createManual(
        { amount: dto.amount, profile_id: profile.id },
        userId,
        trx,
      );
      const sum = await this.transactionRepo.sumAllEarning(profile.id, trx);
      const levels = await this.levelService.connectReachedLevels(
        profile.id,
        sum,
        trx,
      );
      for (const level of levels) {
        if (level.free_gem) {
          totalGem += +level.free_gem;
          await this.createEarning(
            {
              profile_id: profile.id,
              level_id: level.id,
              total_gem: level.free_gem,
            },
            trx,
          );
        }
      }
      await this.profileService.update(
        profile.id,
        {
          gem: profile.gem + totalGem,
        },
        trx,
      );
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
    if (!product) throw new NotFoundException('Product not found');
    totalGem += product.price;
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

  async findAll(dto: TransactionFinishedList) {
    return await this.transactionRepo.findAll(dto);
  }

  async updateStatus(dto: TransactionUpdateStatus) {
    if (dto.status === TransactionStatusEnum.REFUND) {
      await this.createManual(
        { uid: dto.uid, amount: dto.amount },
        dto.student_id,
      );
    }
    return await this.transactionRepo.updateStatus(dto.id, dto.status);
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
