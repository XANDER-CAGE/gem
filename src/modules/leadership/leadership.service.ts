import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeadershipDto } from './dto/create-leadership.dto';
import { UpdateLeadershipDto } from './dto/update-leadership.dto';
import { LeadershipRepo } from './repo/leadership.repo';
import { StudentProfilesService } from '../student-profiles/student-profiles.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class LeadershipService {
  @Inject() private readonly leadershipRepo: LeadershipRepo;
  @Inject() private readonly studentProfileService: StudentProfilesService;

  async create(createLeadershipDto: CreateLeadershipDto) {
    const { profile_id } = createLeadershipDto;
    if (profile_id) {
      const exist = await this.studentProfileService.findOne(profile_id);
      if (!exist) {
        throw new NotFoundException('This profile id dies not exist');
      }
    }
    return await this.leadershipRepo.create(createLeadershipDto);
  }

  async findAll(findAllLeadershipRepo: PaginationDto) {
    return await this.leadershipRepo.findAll(findAllLeadershipRepo);
  }

  async findOne(id: string) {
    return await this.leadershipRepo.findOne(id);
  }

  async update(id: string, updateLeadershipDto: UpdateLeadershipDto) {
    const { profile_id } = updateLeadershipDto;
    if (profile_id) {
      const exist = await this.studentProfileService.findOne(profile_id);
      if (!exist) {
        throw new NotFoundException('This profile id does not exist');
      }
    }
    return await this.leadershipRepo.update(id, updateLeadershipDto);
  }

  async remove(id: string) {
    return await this.leadershipRepo.deleteOne(id);
  }
}
