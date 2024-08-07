import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { BadgeEntity } from '../entity/badge.entity';
import { IFindAllBadge } from '../interface/find_all.interface';
import { CreateBadgeDto } from '../dto/create-badge.dto';
import { UpdateBadgeDto } from '../dto/update-badge.dto';
import { tableName } from 'src/common/var/table-name.var';
import { IFindUnderdoneBadge } from '../interface/getUnderdoneBadge.interface';

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
    return knex(this.relationToProfile)
      .update(column, value)
      .where('id', connectionId)
      .returning('*');
  }
}
