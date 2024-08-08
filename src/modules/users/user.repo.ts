import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { tableName } from 'src/common/var/table-name.var';

@Injectable()
export class UserRepo {
  private readonly users = tableName.users;
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findUserByToken(token: string, knex = this.knex) {
    const user = await knex
      .select('u.*', knex.raw('to_json(sp.*) as profile'))
      .from(`${this.users} as u`)
      .join('student_profiles as sp', 'sp.student_id', 'u.id')
      .where('token', token)
      .andWhere('is_deleted', false)
      .andWhere('is_blocked', false)
      .andWhere('is_archived', false)
      .andWhere('is_verified', true)
      .first();
    return user;
  }
}
