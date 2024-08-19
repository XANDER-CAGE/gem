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

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findAll(
    dto: PaginationDto,
    knex = this.knex,
  ): Promise<IFindAllStudentProfile> {
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
      .select('*', knex.raw('gem::double precision as gem'))
      .from(this.table)
      .where('id', id)
      .andWhere('deleted_at', null)
      .first();
  }
  async create(data: CreateStudentProfileDto, knex = this.knex) {
    return await knex(this.table).insert(data).returning('*');
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
}
