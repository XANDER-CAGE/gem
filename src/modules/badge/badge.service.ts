import { Inject, Injectable } from '@nestjs/common';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { BadgeRepo } from './repo/badge.repo';

@Injectable()
export class BadgeService {
  constructor(@Inject() private readonly badgeRepo: BadgeRepo) {}

  create(createBadgeDto: CreateBadgeDto) {
    return this.badgeRepo.create(createBadgeDto);
  }

  findAll() {
    return `This action returns all badge`;
  }

  findOne(id: string) {
    return `This action returns a #${id} badge`;
  }

  update(id: number, updateBadgeDto: UpdateBadgeDto) {
    console.log(updateBadgeDto);

    return `This action updates a #${id} badge`;
  }

  remove(id: number) {
    return `This action removes a #${id} badge`;
  }
}
