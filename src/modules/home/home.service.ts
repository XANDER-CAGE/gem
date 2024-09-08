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
import { BufferedFile } from 'src/common/interface/buffered-file.interface';
import { FileService } from '../file/file.service';
import { AssignmentRepo } from './repo/assignment.repo';

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
    private readonly fileService: FileService,
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
      const product = await this.productService.findOne(dto.product_id);
      if (!product) throw new NotFoundException('Product not found');
      if (product.remaining_count == 0) {
        throw new NotAcceptableException('Product sold out');
      }
      if (product.price > profile.gem) {
        throw new NotAcceptableException('Insufficient funds');
      }
      await this.productService.update(
        product.id,
        {
          remaining_count: product.remaining_count - 1,
        },
        trx,
      );
      await this.productService.connectToProfile(profile.id, product.id, trx);
      await this.profileService.update(
        profile.id,
        {
          gem: profile.gem - product.price,
        },
        trx,
      );
      await this.transactionService.createSpending(
        {
          product_id: product.id,
          profile_id: profile.id,
        },
        trx,
      );
    });
    return CoreApiResponse.success(null);
  }

  async handleGradeCron() {
    const grades = await this.achievementsService.getGrades();
    for (const comp of grades) {
      for (const { profile_id } of comp.grades) {
        await this.assignAchievement(profile_id, comp.achievement_id);
      }
    }
  }

  async uploadHomework(
    file: BufferedFile,
    userId: string,
    profileId: string,
    knex = this.knex,
  ) {
    return await knex.transaction(async (trx) => {
      const uploadedFile = await this.fileService.upload(file, userId, trx);
      const achievement = await this.achievementsService.findOneByType(
        'assignment',
        trx,
      );
      await this.assignAchievement(profileId, achievement.id, trx).catch(
        (error) => console.log(error),
      );
      await this.assignmentRepo.create(uploadedFile.id, profileId, trx);
      return uploadedFile;
    });
  }
}
