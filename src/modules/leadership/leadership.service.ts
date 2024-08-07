import { Inject, Injectable } from '@nestjs/common';
import { LeadershipRepo } from './repo/leadership.repo';
import {
  LimitWithTopListBySchoolDto,
  LimitWithTopListDto,
} from './dto/create-leadership.dto';
import { TopListTypeEnum } from './enum/leadership.enum';
import { StudentProfilesService } from '../student-profiles/student-profiles.service';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class LeadershipService {
  @Inject() private readonly leadershipRepo: LeadershipRepo;
  @Inject() private readonly profileService: StudentProfilesService;
  @Inject() private readonly transactionService: TransactionService;

  async saveLeadership() {
    return await this.leadershipRepo.saveLeadership();
  }

  async listOfLeadership(dto: LimitWithTopListDto) {
    if (dto.listType === TopListTypeEnum.STUDENT_TOP_BY_GEM) {
      return await this.profileService.findTopList(dto.limit);
    } else {
      return await this.transactionService.listTopEarning(dto.limit);
    }
  }

  async listOfLeadershipBySchool(dto: LimitWithTopListBySchoolDto) {
    if (dto.listType === TopListTypeEnum.STUDENT_TOP_BY_GEM) {
      return await this.profileService.findTopListBySchool(
        dto.school_id,
        dto.limit,
      );
    } else {
      return await this.transactionService.listTopEarningBySchool(
        dto.school_id,
        dto.limit,
      );
    }
  }
}
