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
  private readonly profileTable = tableName.studentProfiles;
  private readonly assignedCoursesTable = tableName.assignedCourses;
  private readonly gradesTable = tableName.grades;
  private readonly functionReferenceTable = tableName.functionReference;
  private readonly achievementTable = tableName.achievements;

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
            'achieved_at', pb.joined_at
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

  async getGrades(knex = this.knex) {
    const now = Date.now();
    const yesterday = new Date(now - 1000 * 60 * 60 * 24)
      .toISOString()
      .split('T')[0];
    const data = knex(`${this.gradesTable} as g`)
      .join(`${this.assignedCoursesTable} as ac`, function () {
        this.on('g.assigned_course_id', '=', 'ac.id').andOn(
          knex.raw('ac.is_deleted = false'),
        );
      })
      .join(`${this.functionReferenceTable} as fr`, function () {
        this.on('fr.id', '=', 'g.component_id').andOn(
          knex.raw('fr.is_deleted = false'),
        );
      })
      .join(`${this.profileTable} as sp`, function () {
        this.on('g.student_id', 'sp.student_id').andOn(
          knex.raw('sp.deleted_at is null'),
        );
      })
      .join(`${this.achievementTable} as a`, function () {
        this.on('a.component_id', 'fr.id').andOn(
          knex.raw('a.deleted_at is null'),
        );
      })
      .whereIn('fr.id', [
        '64fe738e0274a5187fe76d5b',
        '64fe738e397b9a187f529943',
      ])
      .andWhere('g.is_deleted', false)
      .andWhere('g.is_published', true)
      .andWhere('g.score', '>=', 90)
      .andWhere('g.created_at', '>', yesterday)
      .groupBy('fr.name', 'fr.id', 'a.id')
      .select(
        'fr.name as component_name',
        'fr.id as comp_id',
        'a.id as achievement_id',
        knex.raw(`json_agg(json_build_object('profile_id', sp.id)) as grades`),
      );
    return data;
  }
}
