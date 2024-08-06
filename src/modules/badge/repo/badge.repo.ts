import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { BadgeEntity } from '../entity/badge.entity';
import { IFindAllBadge } from '../interface/find_all.interface';
import { CreateBadgeDto } from '../dto/create-badge.dto';
import { UpdateBadgeDto } from '../dto/update-badge.dto';
import { tableName } from 'src/common/var/table-name.var';
import { ProfileBadgeEntity } from '../entity/profile-badge.entity';

export class BadgeRepo {
  private readonly table = tableName.badges;
  private readonly relationToProfile = tableName.profilesM2Mbadges;
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

  async findAll(dto: PaginationDto, knex = this.knex): Promise<IFindAllBadge> {
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

  async connectToProfile(profileId: string, badgeId: string, knex = this.knex) {
    return await knex
      .insert({
        profile_id: profileId,
        badge_id: badgeId,
      })
      .into(this.relationToProfile)
      .returning('*');
  }

  async findConnectionToProfile(
    profileId: string,
    badgeId: string,
    knex = this.knex,
  ) {
    return await knex
      .select('*')
      .from(this.relationToProfile)
      .where('profile_id', profileId)
      .andWhere('badge_id', badgeId)
      .first();
  }

  async getUnderdoneBadge(
    profileId: string,
    achievemntId: string,
    knex = this.knex,
  ): Promise<ProfileBadgeEntity> {
    return knex
      .select('*', 'b.progress as badge_progress')
      .leftJoin(`${this.relationToProfile} as pb`, 'b.id', 'pb.badge_id')
      .from(`${this.table} as b`)
      .where('pb.profile_id', profileId)
      .andWhere('b.achievement_id', achievemntId)
      .andWhereRaw('pb.progress != b.progress')
      .orderBy('level', 'asc')
      .first();
  }

  async getByLevel(
    level: number,
    acheievementId: string,
    knex = this.knex,
  ): Promise<BadgeEntity> {
    return knex
      .select('*')
      .from(this.table)
      .where('level', level)
      .andWhere('acheievement_id', acheievementId)
      .first();
  }
}
