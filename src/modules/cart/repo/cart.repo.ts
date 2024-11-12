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

  //   "name": "book2",
  // "description": null,
  // "avatar": null,
  // "type": null,
  // "price": "200.00",
  // "remaining_count": 5,
  // "limited": false,
  // "type_item": "item"
  async add(product_id: string, profile_id: string, knex = this.knex) {
    await knex(`${this.table} as c`)
      .where('c.profile_id', profile_id)
      .andWhere('c.product_id', product_id)
      .whereNull('c.deleted_at')
      .increment('count', 1);

    const result = await knex(`${this.table} as c`)
      .select([
        'c.*',
        'mp.name',
        'mp.description',
        'mp.avatar',
        'mp.type',
        'mp.price',
        'mp.limited',
        knex.raw('c.count * mp.price AS overall_price'),
      ])
      .leftJoin(`${this.productTable} as mp`, 'c.product_id', 'mp.id')
      .where('c.profile_id', profile_id)
      .andWhere('c.product_id', product_id)
      .whereNull('c.deleted_at');

    return result;
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

    const result = await knex(`${this.table} as c`)
      .select([
        'c.*',
        'mp.name',
        'mp.description',
        'mp.avatar',
        'mp.type',
        'mp.price',
        'mp.limited',
        knex.raw('c.count * mp.price AS overall_price'),
      ])
      .leftJoin(`${this.productTable} as mp`, 'c.product_id', 'mp.id')
      .where('c.profile_id', profile_id)
      .andWhere('c.product_id', product_id)
      .whereNull('c.deleted_at')
      .select('c.id', 'c.count')
      .first();

    if (result.count === 0) {
      await knex(this.table).where({ id: result.id }).delete();
      return true;
    }
    return result;
  }

  async remove(id: string, knex = this.knex) {
    await knex(this.table).where('id', id).update({ deleted_at: new Date() });
  }
}
