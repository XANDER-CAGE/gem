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

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findAll(dto: PaginationDto, knex = this.knex) {
    const { limit = 10, page = 1 } = dto;
    const innerQuery = knex(this.table)
      .select('*')
      .where('deleted_at', null)
      .limit(limit)
      .offset((page - 1) * limit)
      .as('c');
    const [{ total, data }] = await knex
      .select([
        knex.raw(
          '(SELECT COUNT(id) FROM ?? WHERE deleted_at is null) AS total',
          this.table,
        ),
        knex.raw('jsonb_agg(c.*) AS data'),
      ])
      .from(innerQuery);

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
    return await knex('grades as g')
      .join('assigned_courses as ac', function () {
        this.on('g.assigned_course_id', '=', 'ac.id').andOn(
          knex.raw('ac.is_deleted = false'),
        );
      })
      .join('functions_reference as fr', function () {
        this.on('fr.id', '=', 'g.component_id').andOn(
          knex.raw('fr.is_deleted = false'),
        );
      })
      .join('student_profiles as sp', function () {
        this.on('g.student_id', 'sp.student_id').andOn(
          knex.raw('sp.deleted_at is null'),
        );
      })
      .join('achievements as a', function () {
        this.on('a.component_id', 'fr.id').andOn(
          knex.raw('a.deleted_at is null'),
        );
      })
      .where('g.is_deleted', false)
      .whereIn('fr.id', [
        '64fe738e0274a5187fe76d5b',
        '64fe738e397b9a187f529943',
      ])
      .where('g.score', '>=', 90)
      .where('g.created_at', '>', yesterday)
      .groupBy('fr.name', 'fr.id')
      .select(
        'fr.name as component_name',
        'fr.id as comp_id',
        'a.id as achievement_id',
        knex.raw(`json_agg(json_build_object('profile_id', sp.id)) as grades`),
      );
  }
}
