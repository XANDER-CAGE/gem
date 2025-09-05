import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { tableName } from 'src/common/var/table-name.var';

@Injectable()
export class UserRepo {
  private readonly users = tableName.users;
  private readonly profileTable = tableName.studentProfiles;
  private readonly tokensTable = tableName.tokens;
  constructor(@InjectConnection() private readonly knex: Knex) { }

  async findUserByToken(token: string, knex = this.knex) {
    const user = knex
      .select('u.*', knex.raw('to_json(sp.*) as profile'))
      .join(`${this.users} as u`, 'u.id', 't.user_id')
      .leftJoin(`${this.profileTable} as sp`, 'sp.student_id', 'u.id')
      .from(`${this.tokensTable} as t`)
      .where('t.access_token', token)
      .andWhere('u.is_deleted', false)
      .andWhere('u.is_blocked', false)
      .andWhere('u.is_archived', false)
      .andWhere('t.is_deleted', false)
      .andWhere('t.expired_at', '>', new Date())
      .first();


    return user;
  }
}
