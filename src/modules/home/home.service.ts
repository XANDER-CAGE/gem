import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { StudentProfilesService } from '../student-profiles/student-profiles.service';
import { TransactionService } from '../transaction/transaction.service';
import { LevelService } from '../level/level.service';
import { BadgeService } from '../badge/badge.service';
import { AchievementsService } from '../achievements/achievements.service';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { BuyProductDto } from '../market-products/dto/buy.product.dto';
import { StudentProfileEntity } from '../student-profiles/entity/student-profile.entity';
import { ProductsService } from '../market-products/market-products.service';
import { AssignmentRepo } from './repo/assignment.repo';
import { UploadHomeworkDto } from './dto/upload-homework.dto';

@Injectable()
export class HomeService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly profileService: StudentProfilesService,
    private readonly transactionService: TransactionService,
    private readonly levelService: LevelService,
    private readonly badgeService: BadgeService,
    private readonly achievementsService: AchievementsService,
    private readonly productService: ProductsService,
    private readonly assignmentRepo: AssignmentRepo,
  ) {}

  async assignAchievement(
    profileId: string,
    achievementId: string,
    knex = this.knex,
  ) {
    let totalGem = 0;
    const achievement = await this.achievementsService.findOne(achievementId);
    if (!achievement) throw new NotFoundException('Achievement not found');
    const profile = await this.profileService.findOne(profileId);
    if (!profile) throw new NotFoundException('Student not in gamification');
    const underdoneBadge = await this.badgeService.getUnderdoneBadge(
      profileId,
      achievementId,
    );
    if (!underdoneBadge) throw new NotAcceptableException('No more badges');
    const { badge, user_progress, connection_id } = underdoneBadge;
    await knex.transaction(async (trx) => {
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
        totalGem += badge.reward_gem;
        await this.transactionService.createEarning(
          {
            badge_id: badge.id,
            total_gem: badge.reward_gem,
            profile_id: profileId,
          },
          trx,
        );
        const total = await this.transactionService.sumAllEarning(
          profileId,
          trx,
        );
        const levels = await this.levelService.connectReachedLevels(
          profileId,
          total,
          trx,
        );
        for (const level of levels) {
          totalGem += level.free_gem;
          if (level.free_gem) {
            await this.transactionService.createEarning(
              {
                profile_id: profile.id,
                level_id: level.id,
                total_gem: level.free_gem,
              },
              trx,
            );
          }
        }
        await this.profileService.update(
          profile.id,
          { gem: profile.gem + totalGem },
          trx,
        );
      }
    });
    return CoreApiResponse.success(null);
  }

  async buyProduct(dto: BuyProductDto, profile: StudentProfileEntity) {
    await this.knex.transaction(async (trx) => {
      const product = await this.productService.findOne(dto.product_id, trx);
      if (!product) throw new NotFoundException('Product not found');
      if (product.remaining_count === 0) {
        throw new NotAcceptableException('Product sold out');
      }

      const freshProfile = await this.profileService.findOne(profile.id, trx);
      if (Number(product.price) > Number(freshProfile.gem)) {
        throw new NotAcceptableException('Insufficient funds');
      }

      await this.productService.update(
        product.id,
        {
          remaining_count: product.remaining_count - 1,
        },
        trx,
      );

      await this.productService.connectToProfile(
        freshProfile.id,
        product.id,
        trx,
      );

      await this.profileService.update(
        freshProfile.id,
        {
          gem: Number(freshProfile.gem) - Number(product.price),
        },
        trx,
      );

      await this.transactionService.createSpending(
        {
          product_id: product.id,
          profile_id: freshProfile.id,
        },
        trx,
      );
    });

    return CoreApiResponse.success(null);
  }

  async handleGradeCron() {
    try {
      for (const type of ['mid_term', 'final']) {
        try {
          const grades = await this.achievementsService.getGrades(type);
          const midtermAchievement =
            await this.achievementsService.findOneByType(type);
          if (!midtermAchievement) {
            throw new Error('Midterm achievement not found');
          }
          for (const grade of grades) {
            try {
              await this.knex.transaction(async (trx) => {
                const profile = await this.profileService.getProfileByColumn(
                  'student_id',
                  grade.student_id,
                );
                if (!profile) return;
                if (grade.percentage < 40) return;
                const level =
                  grade.percentage >= 80 ? 3 : grade.percentage >= 60 ? 2 : 1;
                const badge = await this.badgeService.getBadgeByLevel(
                  level,
                  midtermAchievement.id,
                  trx,
                );
                if (!badge) return;
                const userHasTheBadge =
                  await this.badgeService.userHaveTheBadge(
                    profile.id,
                    badge.id,
                    trx,
                  );
                if (userHasTheBadge) return;
                await this.badgeService.connectToProfile(
                  profile.id,
                  badge.id,
                  1,
                  trx,
                );
                if (badge.reward_gem) {
                  await this.transactionService.createEarning(
                    {
                      badge_id: badge.id,
                      total_gem: badge.reward_gem,
                      profile_id: profile.id,
                    },
                    trx,
                  );
                  const total = await this.transactionService.sumAllEarning(
                    profile.id,
                    trx,
                  );
                  const levels = await this.levelService.connectReachedLevels(
                    profile.id,
                    total,
                    trx,
                  );
                  for (const level of levels) {
                    badge.reward_gem += level.free_gem;
                    if (level.free_gem) {
                      await this.transactionService.createEarning(
                        {
                          profile_id: profile.id,
                          level_id: level.id,
                          total_gem: level.free_gem,
                        },
                        trx,
                      );
                    }
                  }
                  await this.profileService.update(
                    profile.id,
                    { gem: +profile.gem + +badge.reward_gem },
                    trx,
                  );
                }
              });
            } catch (error) {
              console.log(error.message);
              continue;
            }
          }
        } catch (error) {
          console.log(error.message);
          continue;
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async uploadHomework(
    dto: UploadHomeworkDto,
    userId: string,
    profileId: string,
    knex = this.knex,
  ) {
    return await knex.transaction(async (trx) => {
      // const uploadedFile = await this.fileService.upload(file, userId, trx);
      await this.achievementsService.assignment(profileId, trx);
      await this.assignmentRepo.create(dto.file_id, profileId, trx);
    });
  }
}
