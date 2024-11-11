import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { tableName } from 'src/common/var/table-name.var';
import { CreateCartDto } from '../dto/create-cart.dto';

export class CartRepo {
  private readonly table = tableName.cart;
  private readonly productTable = tableName.marketProducts;

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async existProfile(product_id: string, profile_id: string, knex = this.knex) {
    return await knex(this.table)
      .where('profile_id', profile_id)
      .andWhere('product_id', product_id)
      .whereNull('deleted_at')
      .first();
  }

  async create(data: CreateCartDto, profile_id: string, knex = this.knex) {
    return await knex
      .insert({ ...data, profile_id })
      .into(this.table)
      .returning('*');
  }

  async add(product_id: string, profile_id: string, knex = this.knex) {
    return await knex(this.table)
      .where('profile_id', profile_id)
      .andWhere('product_id', product_id)
      .whereNull('deleted_at')
      .increment('count', 1)
      .returning('*');
  }

  async list(profile_id: string, knex = this.knex) {
    return await knex(this.table)
      .where('profile_id', profile_id)
      .whereNull('deleted_at')
      .returning('*');
  }

  async findAll(profile_id: string, knex = this.knex) {
    const items = await knex(`${this.table} as c`)
      .leftJoin(`${this.productTable} as mp`, 'c.product_id', 'mp.id')
      .select('mp.name', 'mp.avatar', 'mp.description', 'mp.price', 'c.count')
      .where('c.profile_id', profile_id)
      .whereNull('c.deleted_at');

    const total_price = items.reduce(
      (sum, item) => sum + item.price * item.count,
      0,
    );

    return {
      items,
      total_price,
    };
  }

  async reduce(product_id: string, profile_id: string, knex = this.knex) {
    await knex(this.table)
      .where('profile_id', profile_id)
      .andWhere('product_id', product_id)
      .whereNull('deleted_at')
      .decrement('count', 1);

    const reducedData = await knex(this.table)
      .where('profile_id', profile_id)
      .andWhere('product_id', product_id)
      .whereNull('deleted_at')
      .select('id', 'count')
      .first();

    if (reducedData.count === 0) {
      await knex(this.table).where({ id: reducedData.id }).delete();
    }
    return true;
  }

  async remove(id: string, knex = this.knex) {
    await knex(this.table).where('id', id).update({ deleted_at: new Date() });
  }
}
