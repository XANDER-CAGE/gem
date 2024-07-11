import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';

@Injectable()
export class UserRepo {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findUserByToken(token: string, knex = this.knex) {
    const { get_user_data_by_token: user } = await knex
      .select(`*`)
      .from(knex.raw(`get_user_data_by_token(?)`, [token]))
      .first();
    return user;
  }
}
