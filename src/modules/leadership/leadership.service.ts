import { Inject, Injectable } from '@nestjs/common';
import { LeadershipRepo } from './repo/leadership.repo';

@Injectable()
export class LeadershipService {
  @Inject() private readonly leadershipRepo: LeadershipRepo;

  async saveLeadership() {
    return await this.leadershipRepo.saveLeadership();
  }
}
