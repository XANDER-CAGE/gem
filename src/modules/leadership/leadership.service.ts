import { Inject, Injectable } from '@nestjs/common';
import { LeadershipRepo } from './repo/leadership.repo';
import { LimitWithTopListDto } from './dto/create-leadership.dto';

@Injectable()
export class LeadershipService {
  @Inject() private readonly leadershipRepo: LeadershipRepo;

  async saveLeadership() {
    return await this.leadershipRepo.saveLeadership();
  }

  async listOfLeadershipBySchool(dto: LimitWithTopListDto, profile_id: string) {
    return await this.leadershipRepo.findTopListBySchool(dto.limit, profile_id);
  }
}
