import { Inject, Injectable } from '@nestjs/common';
import { UserRepo } from './user.repo';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UsersService {
  @Inject() userRepo: UserRepo;
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async getUser(token: string): Promise<UserEntity> {
    return this.userRepo.findUserByToken(token, this.knex);
  }
}
