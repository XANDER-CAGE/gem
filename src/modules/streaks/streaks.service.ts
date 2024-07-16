import { Injectable } from '@nestjs/common';
import { CreateStreakDto, UpdateStreakDto } from './dto/streaks.dto';

@Injectable()
export class StreaksService {
  create(createStreakDto: CreateStreakDto) {
    return 'This action adds a new streak';
  }

  findAll() {
    return `This action returns all streaks`;
  }

  findOne(id: string) {
    return `This action returns a #${id} streak`;
  }

  update(id: number, updateStreakDto: UpdateStreakDto) {
    return `This action updates a #${id} streak`;
  }

  remove(id: number) {
    return `This action removes a #${id} streak`;
  }
}
