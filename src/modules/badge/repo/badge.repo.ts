import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { BadgeEntity } from '../entity/badge.entity';
import { IFindAllBadge } from '../interface/find_all.interface';
import { CreateBadgeDto } from '../dto/create-badge.dto';
import { UpdateBadgeDto } from '../dto/update-badge.dto';
import { tableName } from 'src/common/var/table-name.var';
import { IFindUnderdoneBadge } from '../interface/getUnderdoneBadge.interface';
import { FindAllBadgesDto } from '../dto/find-all.badge.dto';

export class BadgeRepo {
  private readonly table = tableName.badges;
  private readonly relationToProfile = tableName.profilesM2Mbadges;
  private readonly achievements = tableName.achievements;
  private readonly assignments = tableName.assignment;
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(dto: CreateBadgeDto, knex = this.knex): Promise<BadgeEntity> {
    const [data] = await knex
      .insert({
        ...dto,
      })
      .into(this.table)
      .returning('*');
    return data;
  }

  async findAll(
    dto: FindAllBadgesDto,
    knex = this.knex,
  ): Promise<IFindAllBadge> {
    const { limit = 10, page = 1 } = dto;
    const innerQuery = knex(this.table)
      .select('*')
      .where('deleted_at', null)
      .andWhere(function () {
        if (dto.achievement_id) {
          this.where('achievement_id', dto.achievement_id);
        }
      })
      .orderBy('reward_gem')
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

  async findOne(id: string, knex = this.knex): Promise<BadgeEntity> {
    return await knex
      .select('*')
      .from(this.table)
      .where('id', id)
      .andWhere('deleted_at', null)
      .first();
  }

  async update(
    id: string,
    dto: UpdateBadgeDto,
    knex = this.knex,
  ): Promise<BadgeEntity> {
    const [data] = await knex(this.table)
      .update({
        ...dto,
        updated_at: new Date(),
      })
      .where('id', id)
      .andWhere('deleted_at', null)
      .returning('*');
    return data;
  }

  async delete(id: string, knex = this.knex): Promise<void> {
    await knex(this.table)
      .update({
        deleted_at: new Date(),
        updated_at: new Date(),
      })
      .where('id', id)
      .andWhere('deleted_at', null);
  }

  async connectToProfile(
    profileId: string,
    badgeId: string,
    progress: number,
    knex = this.knex,
  ) {
    return await knex
      .insert({
        profile_id: profileId,
        progress: progress,
        badge_id: badgeId,
      })
      .into(this.relationToProfile)
      .returning('*');
  }

  async getUnderdoneBadge(
    profileId: string,
    achievementId: string,
    knex = this.knex,
  ): Promise<IFindUnderdoneBadge> {
    return await knex
      .select(
        knex.raw([
          'to_json(b.*) as badge',
          'case when pb.progress is null then 0 else pb.progress end as user_progress',
          'pb.id as connection_id',
        ]),
      )
      .from(`${this.table} as b`)
      .leftJoin(`${this.relationToProfile} as pb`, function () {
        this.on('pb.badge_id', 'b.id').andOnVal('pb.profile_id', profileId);
      })
      .where('b.achievement_id', achievementId)
      .andWhere(knex.raw('b.progress != coalesce(pb.progress,0)'))
      .orderBy('level', 'asc')
      .first();
  }

  async getByLevel(
    level: number,
    achievementId: string,
    knex = this.knex,
  ): Promise<BadgeEntity> {
    return knex
      .select('*')
      .from(this.table)
      .where('level', level)
      .andWhere('achievement_id', achievementId)
      .first();
  }

  async updateConnection(
    column: string,
    value: any,
    connectionId: string,
    knex = this.knex,
  ) {
    return await knex(this.relationToProfile)
      .update(column, value)
      .update(`joined_at`, new Date().toISOString())
      .where('id', connectionId)
      .returning('*');
  }

  async checkForPopUp(profileId: string, knex = this.knex) {
    return knex
      .select('b.*', 'pb.id as connection_id')
      .from(`${this.relationToProfile} as pb`)
      .leftJoin(`${this.table} as b`, 'pb.badge_id', 'b.id')
      .where('pb.profile_id', profileId)
      .andWhere(knex.raw('b.progress = pb.progress'))
      .andWhere('pb.is_shown', false);
  }

  async getByAchievement(achievementId: string, knex = this.knex) {
    return knex
      .select('*')
      .from(this.table)
      .whereNull('deleted_at')
      .andWhere('achievement_id', achievementId);
  }

  async getUnderdoneAssignment(
    profileId: string,
    assignmentCount: number,
    knex = this.knex,
  ) {
    return await knex
      .select(
        'b.*',
        knex.raw([
          'coalesce(pb.progress, 0) as user_progress',
          'pb.id as connection_id',
        ]),
      )
      .leftJoin(`${this.relationToProfile} as pb`, function () {
        this.on('pb.badge_id', 'b.id').andOnVal('pb.profile_id', profileId);
      })
      .join(`${this.achievements} as a`, function () {
        this.on('a.id', 'b.achievement_id')
          .andOnNull('a.deleted_at')
          .andOnVal('a.type', 'assignment');
      })
      .from(`${this.table} as b`)
      .whereNull('b.deleted_at')
      .andWhereRaw('pb.progress != b.progress')
      .andWhere('pb.progress', '<', assignmentCount);
  }

  async assignmentCount(profileId: string, knex = this.knex) {
    const [data]: any[] = await knex
      .count('id')
      .from(this.assignments)
      .where('profile_id', profileId);
    return +data.count || 0;
  }

  async userHaveTheBadge(profileId: string, badgeId: string, knex = this.knex) {
    const badges = await knex
      .select('b.*')
      .from(`${this.relationToProfile} as pb`)
      .where('pb.profile_id', profileId)
      .andWhere('pb.badge_id', badgeId)
      .join(`${tableName.badges} as b`, 'b.id', 'pb.badge_id');
    return badges.length != 0;
  }
}
