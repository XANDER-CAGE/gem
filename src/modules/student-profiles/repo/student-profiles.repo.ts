import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IFindAllStudentProfile } from '../interface/student-profile.interface';
import { CreateStudentProfileDto } from '../dto/create-student-profile.dto';
import { UpdateStudentProfileDto } from '../dto/update-student-profile.dto';
import { tableName } from 'src/common/var/table-name.var';

@Injectable()
export class StudentProfilesRepo {
  private table = tableName.studentProfiles;
  private student_table = tableName.students;
  private levels_on_profiles_table = tableName.levelsM2MProfiles;
  private levels_table = tableName.levels;
  private transaction_table = tableName.transactions;

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findAll(
    dto: PaginationDto,
    knex = this.knex,
  ): Promise<IFindAllStudentProfile> {
    const { limit = 10, page = 1 } = dto;
    const innerQuery = knex(this.table)
      .select(
        'st.uid',
        'st.first_name',
        'st.last_name',
        'st.level',
        'st.avatar',
        'sp.*',
        knex.raw('sp.gem::double precision as gem'),
      )
      .from({ sp: this.table })
      .where('sp.deleted_at', null)
      .leftJoin({ st: this.student_table }, 'sp.student_id', 'st.id')
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

  // async findTopList(limit: number, profile_id: string, knex = this.knex) {
  //   const data = knex
  //     .with('RankedProfiles', (qb) => {
  //       qb.select(
  //         '*',
  //         knex.raw(
  //           'ROW_NUMBER() OVER (ORDER BY p.gem DESC) AS position_by_gem',
  //         ),
  //       )
  //         .from('student_profiles AS p')
  //         .whereNull('p.deleted_at');
  //     })
  //     .select(
  //       'rp.*',
  //       knex.raw(
  //         '(COALESCE(l.last_position_by_gem, rp.position_by_gem) - rp.position_by_gem) AS status',
  //       ),
  //       knex.raw(
  //         `case when rp.id = '${profile_id}' then to_json(rp.*) end as my`,
  //       ),
  //     )
  //     .from('RankedProfiles AS rp')
  //     .leftJoin('leadership AS l', function () {
  //       this.on('l.profile_id', '=', 'rp.id').andOnNull('l.deleted_at');
  //     })
  //     .orderBy('rp.gem', 'desc')
  //     .limit(limit);
  //   return data;
  // }

  async findOne(id: string, knex = this.knex) {
    return await knex
      .select(
        'st.uid',
        'st.first_name',
        'st.last_name',
        'st.avatar',
        'l.name',
        'l.level as stage',
        'sp.*',
        'st.gender',
        knex.raw(
          `(select sum(t.total_gem) from ${this.transaction_table} as t where t.profile_id = sp.id and t.created_at >= NOW() - INTERVAL '1 week')::double precision as transaction_week`,
        ),
        knex.raw('sp.gem::double precision as gem'),
        knex.raw(`
          (select sum(t.total_gem) from ${this.transaction_table} as t where t.profile_id = sp.id and t.total_gem > 0)::double precision as total_point
        `),
        knex.raw(`(
          select lv_current.reward_point from ${this.levels_table} as lv_current
          where lv_current.level = l.level
          limit 1
        ) as current_level_reward_point`),
        knex.raw(`
      (
        select lv_next.reward_point 
        from ${this.levels_table} as lv_next 
        where lv_next.level = l.level + 1
        limit 1
      ) as next_level_reward_point
    `),
      )
      .from({ sp: this.table })
      .leftJoin({ st: this.student_table }, 'sp.student_id', 'st.id')
      .leftJoin(
        { sop: this.levels_on_profiles_table },
        'sp.id',
        'sop.profile_id',
      )
      .leftJoin({ l: this.levels_table }, 'l.id', 'sop.level_id')
      .where('sp.id', id)
      .andWhere('sp.deleted_at', null)
      .orderBy('sop.joined_at', 'desc')
      .first();
  }

  async create(data: CreateStudentProfileDto, knex = this.knex) {
    const [profile] = await knex(this.table).insert(data).returning('*');
    return profile;
  }

  async update(id: string, data: UpdateStudentProfileDto, knex = this.knex) {
    const [updateStudent] = await knex(this.table)
      .update({
        ...data,
        updated_at: new Date(),
      })
      .where('id', id)
      .andWhere('deleted_at', null)
      .returning('*');
    return updateStudent;
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

  async getStudentByColumn(column: string, value: string, knex = this.knex) {
    return knex(this.student_table)
      .select('*')
      .where(column, value)
      .andWhere('is_deleted', false)
      .first();
  }

  async getProfileByColumn(column: string, value: string, knex = this.knex) {
    return await knex
      .select(
        'st.uid',
        'st.first_name',
        'st.last_name',
        'st.avatar',
        'l.name',
        'l.level as stage',
        'sp.*',
        knex.raw(
          `(select sum(t.total_gem) from ${this.transaction_table} as t where t.profile_id = sp.id and t.created_at >= NOW() - INTERVAL '1 week')::double precision as transaction_week`,
        ),
        knex.raw('sp.gem::double precision as gem'),
        knex.raw(`
        (select sum(t.total_gem) from ${this.transaction_table} as t where t.profile_id = sp.id and t.total_gem > 0)::double precision as total_point
      `),
        knex.raw(`(
        select lv_current.reward_point from ${this.levels_table} as lv_current
        where lv_current.level = l.level
        limit 1
      ) as current_level_reward_point`),
        knex.raw(`
    (
      select lv_next.reward_point 
      from ${this.levels_table} as lv_next 
      where lv_next.level = l.level + 1
      limit 1
    ) as next_level_reward_point
  `),
      )
      .from({ sp: this.table })
      .leftJoin({ st: this.student_table }, 'sp.student_id', 'st.id')
      .leftJoin(
        { sop: this.levels_on_profiles_table },
        'sp.id',
        'sop.profile_id',
      )
      .leftJoin({ l: this.levels_table }, 'l.id', 'sop.level_id')
      .where(column, value)
      .andWhere('sp.deleted_at', null)
      .orderBy('sop.joined_at', 'desc')
      .first();
  }
}
