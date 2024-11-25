import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { tableName } from 'src/common/var/table-name.var';
import { CreateAchievementDto } from '../dto/create-achievement.dto';
import { UpdateAchievementDto } from '../dto/update-achievement.dto';
import { AchievementEntity } from '../entities/achievement.entity';

@Injectable()
export class AchievementsRepo {
  private readonly table = tableName.achievements;
  private readonly badgeTable = tableName.badges;
  private readonly profilesBadges = tableName.profilesM2Mbadges;

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findAll(dto: PaginationDto, profileId: string, knex = this.knex) {
    const { limit = 10, page = 1 } = dto;
    const offset = (page - 1) * limit;

    const baseQuery = knex(this.table)
      .select(
        'a.*',
        knex.raw(
          `coalesce(
        jsonb_agg(
          jsonb_build_object(
            'id', b.id,
            'view', b.view,
            'name', b.name,
            'badge_progress', b.progress,
            'user_progress', coalesce(pb.progress, 0),
            'description', b.description,
            'reward_gem', b.reward_gem,
            'achieved_at',  to_char(pb.joined_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
          )
          ORDER BY b.reward_gem ASC
        ) filter (where b.id is not null), 
        '[]'::jsonb
      ) AS badges`,
        ),
      )
      .from(`${this.table} as a`)
      .whereNull('a.deleted_at')
      .leftJoin(`${this.badgeTable} as b`, function () {
        this.on('a.id', 'b.achievement_id').andOnNull('b.deleted_at');
      })
      .leftJoin(`${this.profilesBadges} as pb`, function () {
        this.on('pb.badge_id', 'b.id').andOn(
          knex.raw(`pb.profile_id = '${profileId}'`),
        );
      })
      .groupBy('a.id')
      .limit(limit)
      .offset(offset);

    const [{ total }] = await baseQuery
      .clone()
      .clearSelect()
      .clearOrder()
      .count({ total: 'a.id' });

    const data = await baseQuery;

    return { total: +total, data };
  }

  async findOne(id: string, knex = this.knex) {
    return await knex
      .select('*')
      .from(this.table)
      .where('id', id)
      .andWhere('deleted_at', null)
      .first();
  }

  async findOnByType(
    type: string,
    knex = this.knex,
  ): Promise<AchievementEntity> {
    return await knex
      .select('*')
      .from(this.table)
      .where('type', type)
      .andWhere('deleted_at', null)
      .first();
  }

  async create(data: CreateAchievementDto, knex = this.knex) {
    const [res] = await knex(this.table).insert(data).returning('*');
    return res;
  }

  async update(id: string, data: UpdateAchievementDto, knex = this.knex) {
    const [updatedAchievement] = await knex(this.table)
      .update({
        ...data,
        updated_at: new Date(),
      })
      .where('id', id)
      .andWhere('deleted_at', null)
      .returning('*');
    return updatedAchievement;
  }

  async deleteOne(id: string, knex = this.knex) {
    await knex(this.table)
      .update({
        deleted_at: new Date(),
        updated_at: new Date(),
      })
      .where('id', id)
      .andWhere('deleted_at', null);
  }
}
