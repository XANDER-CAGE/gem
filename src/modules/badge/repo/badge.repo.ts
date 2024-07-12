import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { CreateBadgeDto } from '../dto/create-badge.dto';

export class BadgeRepo {
  private readonly table = 'channels';
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(dto: CreateBadgeDto) {
    console.log(dto);

    return this.knex.insert({});
  }
}
