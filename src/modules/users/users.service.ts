import { Inject, Injectable } from '@nestjs/common';
import { UserRepo } from './user.repo';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';

@Injectable()
export class UsersService {
  @Inject() userRepo: UserRepo;
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async getUser(token: string) {
    return this.userRepo.findUserByToken(token, this.knex);
  }
}
