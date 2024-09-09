import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { AchievementsRepo } from './repo/achievements.repo';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { StudentProfilesService } from '../student-profiles/student-profiles.service';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { BadgeService } from '../badge/badge.service';
import { TransactionService } from '../transaction/transaction.service';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { IGetAGrades } from './interfaces/getgrades.interface';
import { LevelService } from '../level/level.service';

@Injectable()
export class AchievementsService {
  constructor(
    private readonly achievementRepo: AchievementsRepo,
    private readonly profileService: StudentProfilesService,
    private readonly badgeService: BadgeService,
    private readonly transactionService: TransactionService,
    private readonly levelService: LevelService,
    @InjectConnection() private readonly knex: Knex,
  ) {}
  async create(dto: CreateAchievementDto) {
    return await this.achievementRepo.create(dto);
  }

  async findAll(dto: PaginationDto, profileId: string) {
    return await this.achievementRepo.findAll(dto, profileId);
  }

  async findOne(id: string) {
    return await this.achievementRepo.findOne(id);
  }

  async update(id: string, dto: UpdateAchievementDto) {
    return await this.achievementRepo.update(id, dto);
  }

  async remove(id: string) {
    return await this.achievementRepo.deleteOne(id);
  }

  async assignAchievement(
    profileId: string,
    achievementId: string,
    knex = this.knex,
  ) {
    const achievement = await this.findOne(achievementId);
    if (!achievement) throw new NotFoundException('Achievement not found');
    const profile = await this.profileService.findOne(profileId);
    if (!profile) throw new NotFoundException('Student profile not found');
    const { badge, user_progress, connection_id } =
      await this.badgeService.getUnderdoneBadge(profileId, achievementId);
    if (!badge) throw new NotAcceptableException('No more badges');
    await knex.transaction(async (trx) => {
      try {
        if (!user_progress) {
          await this.badgeService.connectToProfile(profileId, badge.id, 1, trx);
        } else {
          await this.badgeService.updateConnection(
            'progress',
            user_progress + 1,
            connection_id,
            trx,
          );
        }
        if (badge.reward_gem && badge.progress == user_progress + 1) {
          await this.transactionService.createEarning(
            {
              badge_id: badge.id,
              total_gem: +badge.reward_gem,
              profile_id: profileId,
            },
            trx,
          );
          await this.profileService.update(
            profile.id,
            { gem: profile.gem + badge.reward_gem },
            trx,
          );
        }
      } catch (error) {
        throw new Error('Assign achievement error');
      }
    });
    return CoreApiResponse.success(null);
  }

  async getGrades(): Promise<IGetAGrades[]> {
    return this.achievementRepo.getGrades();
  }

  async findOneByType(type: string, knex = this.knex) {
    return await this.achievementRepo.findOnByType(type, knex);
  }

  async assignment(profileId: string, knex = this.knex) {
    await knex.transaction(async (trx) => {
      const achievement = await this.findOneByType('assignment', trx);
      if (!achievement) throw new NotFoundException('No assignment found');
      const profile = await this.profileService.findOne(profileId);
      let earnedGem = +profile.gem;
      const assignmentCount = await this.badgeService.assignmentCount(
        profileId,
        trx,
      );
      if (!assignmentCount) {
        const badges = await this.badgeService.getByAchievement(
          achievement.id,
          trx,
        );
        for (const badge of badges) {
          if (badge.progress == 1) {
            await this.transactionService.createEarning(
              {
                profile_id: profileId,
                total_gem: +badge.reward_gem,
                badge_id: badge.id,
              },
              trx,
            );
            earnedGem += +badge.reward_gem;
            await this.profileService.update(
              profile.id,
              { gem: profile.gem + +badge.reward_gem },
              trx,
            );
            await this.levelService.connectReachedLevels(
              profile.id,
              earnedGem,
              trx,
            );
          }
          await this.badgeService.connectToProfile(profileId, badge.id, 1, trx);
        }
        return;
      }
      const badges = await this.badgeService.getUnderdoneAssignment(
        profileId,
        assignmentCount + 1,
        trx,
      );
      for (const badge of badges) {
        if (+badge.user_progress + 1 == +badge.progress) {
          await this.transactionService.createEarning({
            profile_id: profileId,
            total_gem: +badge.reward_gem,
            badge_id: badge.id,
          });
          earnedGem += +badge.reward_gem;
          await this.profileService.update(
            profile.id,
            { gem: profile.gem + +badge.reward_gem },
            trx,
          );
        }
        await this.badgeService.updateConnection(
          'progress',
          badge.user_progress + 1,
          badge.connection_id,
          trx,
        );
      }
      await this.levelService.connectReachedLevels(profile.id, earnedGem, trx);
    });
  }
}
