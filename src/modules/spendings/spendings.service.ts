import { Injectable } from '@nestjs/common';
import { CreateSpendingDto, UpdateSpendingDto } from './dto/spendings.dto';

@Injectable()
export class SpendingsService {
  create(createSpendingDto: CreateSpendingDto) {
    return 'This action adds a new spending';
  }

  findAll() {
    return `This action returns all spendings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} spending`;
  }

  update(id: number, updateSpendingDto: UpdateSpendingDto) {
    return `This action updates a #${id} spending`;
  }

  remove(id: number) {
    return `This action removes a #${id} spending`;
  }
}
