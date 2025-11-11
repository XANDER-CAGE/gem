import { Inject, Injectable } from '@nestjs/common';
import { LimitWithTopListDto } from './dto/create-leadership.dto';
import { LeadershipRepo } from './repo/leadership.repo';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class LeadershipService {
  @Inject() private readonly leadershipRepo: LeadershipRepo;

  @Cron('0 0 21 * * *', { timeZone: 'Asia/Tashkent', name: 'leadership' })
  async saveLeadership() {
    console.log('Leadership cron started');
    return await this.leadershipRepo.saveLeadership();
  }

  async listOfLeadershipBySchool(dto: LimitWithTopListDto, profile_id: string) {
    return await this.leadershipRepo.findTopListBySchool(dto, profile_id);
  }

  async topListByAllSchools(school: string) {
    return await this.leadershipRepo.topListByAllSchools(school);
  }
}
