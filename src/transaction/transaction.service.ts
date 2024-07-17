import { Inject, Injectable } from '@nestjs/common';
import {
  CreateEarningDto,
  CreateSpendingDto,
  UpdateEarningDto,
  UpdateSpendingDto,
} from './dto/create-transaction.dto';
import { TransactionRepo } from './repo/transaction.repo';

@Injectable()
export class TransactionService {
  constructor(@Inject() private readonly transactionRepo: TransactionRepo) {}

  async create(dto: CreateEarningDto | CreateSpendingDto) {
    return await this.transactionRepo.create(dto);
  }

  findAll() {}

  async findOne(id: string) {
    return await this.transactionRepo.findOne(id);
  }

  async update(id: string, dto: UpdateSpendingDto | UpdateEarningDto) {
    return await this.transactionRepo.update(id, dto);
  }

  async remove(id: string) {
    return await this.transactionRepo.delete(id);
  }
}
