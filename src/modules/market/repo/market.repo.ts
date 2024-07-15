import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { ICreateMarket, IUpdateMarket } from '../interface/market.interface';
import { NotFoundError } from 'rxjs';

@Injectable()
export class MarketRepo {
  private table = 'markets';
  private mc_table = 'market_categories';

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async list(knex = this.knex) {
    return await knex(this.table).select('*');
  }

  async findOne(id: string, knex = this.knex) {
    return await knex
      .select('*')
      .from(this.table)
      .where('id', id)
      .andWhere('deleted_at', null)
      .first();
  }
  async existCategoryId(field: string, value: string, knex = this.knex) {
    return await knex(this.mc_table).where(field, value).first();
  }

  async create(data: ICreateMarket, knex = this.knex) {
    return await knex(this.table).insert(data).returning('*');
  }

  async update(id: string, data: IUpdateMarket, knex = this.knex) {
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
}
