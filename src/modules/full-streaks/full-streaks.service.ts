import { Injectable } from '@nestjs/common';
import { CreateFullStreakDto } from './dto/create-full-streak.dto';
import { UpdateFullStreakDto } from './dto/update-full-streak.dto';

@Injectable()
export class FullStreaksService {
  create(createFullStreakDto: CreateFullStreakDto) {
    return 'This action adds a new fullStreak';
  }

  findAll() {
    return `This action returns all fullStreaks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fullStreak`;
  }

  update(id: number, updateFullStreakDto: UpdateFullStreakDto) {
    return `This action updates a #${id} fullStreak`;
  }

  remove(id: number) {
    return `This action removes a #${id} fullStreak`;
  }
}
