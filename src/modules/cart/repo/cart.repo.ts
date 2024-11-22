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
    const [newCartItem] = await knex(this.table)
      .insert({ ...data, profile_id })
      .returning('*');

    const count = await knex(`${this.table} as c`)
      .where('c.profile_id', profile_id)
      .whereNull('c.deleted_at')
      .select('c.*');

    const total_count = count.reduce((sum, item) => sum + item.count, 0);

    const result = await knex(`${this.table} as c`)
      .select([
        'c.*',
        'mp.name',
        'mp.description',
        'mp.avatar',
        'mp.type',
        knex.raw('CAST(mp.price AS INTEGER) AS price'),
        'mp.limited',
        knex.raw('CAST(c.count * mp.price AS INTEGER) AS overall_price'),
      ])
      .leftJoin(`${this.productTable} as mp`, 'c.product_id', 'mp.id')
      .where('c.profile_id', profile_id)
      .andWhere('c.product_id', newCartItem.product_id)
      .whereNull('c.deleted_at')
      .select('c.id', 'c.count')
      .first();

    result.total_count = total_count;

    return result;
  }

  async add(product_id: string, profile_id: string, knex = this.knex) {
    await knex(`${this.table} as c`)
      .where('c.profile_id', profile_id)
      .andWhere('c.product_id', product_id)
      .whereNull('c.deleted_at')
      .increment('count', 1);

    const count = await knex(`${this.table} as c`)
      .where('c.profile_id', profile_id)
      .whereNull('c.deleted_at')
      .returning('c.*');

    const total_count = count.reduce((sum, item) => sum + item.count, 0);

    const result = await knex(`${this.table} as c`)
      .select([
        'c.*',
        'mp.name',
        'mp.description',
        'mp.avatar',
        'mp.type',
        knex.raw('CAST(mp.price AS INTEGER) AS price'),
        'mp.limited',
        knex.raw('CAST(c.count * mp.price AS INTEGER) AS overall_price'),
      ])
      .leftJoin(`${this.productTable} as mp`, 'c.product_id', 'mp.id')
      .where('c.profile_id', profile_id)
      .andWhere('c.product_id', product_id)
      .whereNull('c.deleted_at')
      .select('c.id', 'c.count')
      .first();

    result.total_count = total_count;

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
      .select(
        'mp.id',
        'mp.name',
        'mp.avatar',
        'mp.description',
        knex.raw('CAST(mp.price AS INTEGER) AS price'),
        'c.count',
      )
      .where('c.profile_id', profile_id)
      .whereNull('c.deleted_at');

    const total_price = items.reduce(
      (sum, item) => sum + item.price * item.count,
      0,
    );

    const total_count = items.reduce((sum, item) => sum + item.count, 0);

    return {
      items,
      total_price,
      total_count,
    };
  }

  async reduce(product_id: string, profile_id: string, knex = this.knex) {
    await knex(this.table)
      .where('profile_id', profile_id)
      .andWhere('product_id', product_id)
      .whereNull('deleted_at')
      .decrement('count', 1);

    const items = await knex(`${this.table} as c`)
      .where('c.profile_id', profile_id)
      .whereNull('c.deleted_at')
      .select('c.*');

    const total_count = items.reduce((sum, item) => sum + item.count, 0);

    const result = await knex(`${this.table} as c`)
      .select([
        'c.*',
        'mp.name',
        'mp.description',
        'mp.avatar',
        'mp.type',
        knex.raw('CAST(mp.price AS INTEGER) AS price'),
        'mp.limited',
        knex.raw('CAST(c.count * mp.price AS INTEGER) AS overall_price'),
      ])
      .leftJoin(`${this.productTable} as mp`, 'c.product_id', 'mp.id')
      .where('c.profile_id', profile_id)
      .andWhere('c.product_id', product_id)
      .whereNull('c.deleted_at')
      .select('c.id', 'c.count')
      .first();

    result.total_count = total_count;

    if (result.count === 0) {
      const deletedData = await knex(this.table)
        .where({ id: result.id })
        .first();
      await knex(this.table).where({ id: result.id }).delete();
      return deletedData;
    }

    return result;
  }

  async remove(id: string, knex = this.knex) {
    await knex(this.table).where('id', id).update({ deleted_at: new Date() });
  }
}
