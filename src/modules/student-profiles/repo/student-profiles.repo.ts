import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IFindAllStudentProfile } from '../interface/student-profile.interface';
import { CreateStudentProfileDto } from '../dto/create-student-profile.dto';
import { UpdateStudentProfileDto } from '../dto/update-student-profile.dto';

@Injectable()
export class StudentProfilesRepo {
  private table = 'student_profiles';

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

  async findTopList(limit: number, knex = this.knex) {
    const data = await knex
      .select('p.*')
      .from('student_profiles as p')
      .whereNull('p.deleted_at')
      .select(knex.raw('ROW_NUMBER() OVER (ORDER BY p.gem DESC) AS position'))
      .orderBy('p.gem', 'desc')
      .limit(limit);
    return data;
  }

  async findOne(id: string, knex = this.knex) {
    return await knex
      .select('*')
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
