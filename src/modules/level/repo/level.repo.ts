import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  IFindAllLevel,
  UnreachedLevelsRes,
} from '../interface/level.interface';
import { CreateLevelDto } from '../dto/create-level.dto';
import { UpdateLevelDto } from '../dto/update-level.dto';
import { LevelEntity } from '../entity/level.entity';
import { tableName } from 'src/common/var/table-name.var';

@Injectable()
export class LevelRepo {
  private readonly table = tableName.levels;
  private readonly relationToProfiles = tableName.levelsM2MProfiles;
  private readonly relationToProducts = tableName.levelsM2MProducts;
  private readonly products = tableName.marketProducts;

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findAll(dto: PaginationDto, knex = this.knex): Promise<IFindAllLevel> {
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

  async create(data: CreateLevelDto, knex = this.knex): Promise<LevelEntity> {
    const [res] = await knex(this.table).insert(data).returning('*');
    return res;
  }

  async update(id: string, data: UpdateLevelDto, knex = this.knex) {
    const [updateMarket] = await knex(this.table)
      .update({
        ...data,
        updated_at: new Date(),
      })
      .where('id', id)
      .andWhere('deleted_at', null)
      .returning('*');
    return updateMarket;
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

  async connectToProfile(profileId: string, levelId: string, knex = this.knex) {
    await knex(this.relationToProfiles).insert({
      level_id: levelId,
      profile_id: profileId,
    });
  }

  async getUnreachedLevels(
    profileId: string,
    gems: number,
    knex = this.knex,
  ): Promise<UnreachedLevelsRes[]> {
    const subquery = knex('levels as l')
      .leftJoin('levels_on_profiles as lp', 'lp.level_id', 'l.id')
      .where('lp.profile_id', profileId)
      .select('l.id');

    return await knex('levels as l')
      .leftJoin(`${this.relationToProducts} as lpr`, 'lpr.level_id', 'l.id')
      .leftJoin(`${this.products} as p`, 'lpr.product_id', 'p.id')
      .whereNotIn('l.id', subquery)
      .andWhereRaw(`l.reward_point <= ${gems}`)
      .select(
        knex.raw([
          'l.*',
          'l.free_gem::double precision as free_gem',
          `jsonb_agg(p.*) FILTER (WHERE p.id IS NOT NULL) as products`,
        ]),
      )
      .groupBy('l.id');
  }
}
