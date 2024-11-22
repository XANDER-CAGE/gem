import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { CreateProductDto } from '../dto/create-market-product.dto';
import { ProductEntity } from '../entity/product.interface';
import { IFindAllProduct } from '../interface/market-product.interface';
import { UpdateProductDto } from '../dto/update-market-product.dto';
import { tableName } from 'src/common/var/table-name.var';
import {
  FindAllCategoriesDto,
  FindAllProductsDto,
} from '../dto/find-all.product.dto';
import { FindMyProductsDto } from '../dto/find-my.products.dto';

@Injectable()
export class ProductRepo {
  private readonly table = tableName.marketProducts;
  private readonly relationToProfile = tableName.profilesM2MProducts;

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(
    data: CreateProductDto,
    knex = this.knex,
  ): Promise<ProductEntity> {
    if (!data.sort_number) {
      const maxResult = await knex(`${this.table} as m`)
        .max('m.sort_number as max_sort_number')
        .where('m.market_id', data.market_id)
        .first();

      const max = maxResult?.max_sort_number;

      const [res] = await knex(this.table)
        .insert({ ...data, sort_number: max + 1 })
        .returning('*');
      return res;
    }

    await knex(this.table)
      .where('sort_number', '>=', data.sort_number)
      .increment('sort_number', 1);

    const [res] = await knex(this.table).insert(data).returning('*');
    return res;
  }

  async findAll(
    dto: FindAllProductsDto,
    knex = this.knex,
  ): Promise<IFindAllProduct> {
    const { limit = 10, page = 1 } = dto;
    const innerQuery = knex(this.table)
      .select('*')
      .where('deleted_at', null)
      .andWhere(function () {
        if (dto.market_id) {
          this.where('market_id', dto.market_id);
        }
      });
    if (dto.search) {
      innerQuery.where(
        knex.raw('LOWER(name)'),
        'like',
        `%${dto.search.toLowerCase()}%`,
      );
    }
    innerQuery
      .limit(limit)
      .offset((page - 1) * limit)
      .as('c');
    const [{ total, data }] = await knex
      .select([
        knex.raw(
          '(SELECT COUNT(id) FROM ?? WHERE deleted_at is null) AS total',
          this.table,
        ),
        knex.raw('jsonb_agg(c.*) AS data'),
      ])
      .from(innerQuery);
    return { total: +total, data };
  }

  async listWithCategories(
    dto: FindAllCategoriesDto,
    profile_id: string,
    knex = this.knex,
  ) {
    const { limit = 10, page = 1 } = dto;

    const innerQuery = knex('gamification.market_products as mp')
      .select([
        'm.name as category',
        knex.raw(`json_agg(
      json_build_object(
        'id', mp.id,
        'name', mp.name,
        'description', mp.description,
        'avatar', mp.avatar,
        'type', mp.type,
        'price', mp.price,
        'remaining_count', mp.remaining_count,
        'limited', mp.limited,
        'count', COALESCE(c.count, 0),
        'is_new', CASE 
                    WHEN mp.created_at >= now() - interval '3 days' THEN true
                    ELSE false
                  END
      )
      ORDER BY mp.sort_number
    ) FILTER (WHERE mp.remaining_count > 0) AS products`),
      ])
      .leftJoin('gamification.markets as m', 'mp.market_id', 'm.id')
      .leftJoin('gamification.cart as c', function () {
        this.on('c.product_id', '=', 'mp.id')
          .andOn('c.profile_id', '=', knex.raw('?', [profile_id]))
          .andOnNull('c.deleted_at');
      })
      .whereNull('mp.deleted_at')
      .whereNull('m.deleted_at')
      .groupBy('m.name', 'm.sort_number')
      .havingRaw(
        'json_array_length(json_agg(json_build_object(' +
          `'id', mp.id,` +
          `'name', mp.name,` +
          `'description', mp.description,` +
          `'avatar', mp.avatar,` +
          `'type', mp.type,` +
          `'price', mp.price,` +
          `'remaining_count', mp.remaining_count,` +
          `'limited', mp.limited,` +
          `'count', COALESCE(c.count, 0),` +
          `'is_new', CASE WHEN mp.created_at >= now() - interval '3 days' THEN true ELSE false END` +
          ') ORDER BY mp.sort_number) FILTER (WHERE mp.remaining_count > 0)) > 0',
      )
      .orderBy('m.sort_number')
      .limit(limit)
      .offset((page - 1) * limit)
      .as('c');

    const [{ total }] = await knex('gamification.market_products')
      .whereNull('deleted_at')
      .count({ total: 'id' });

    const data = await knex
      .select(knex.raw('jsonb_agg(c.*) AS data'))
      .from(innerQuery);

    return {
      total: +total,
      data: data[0].data || [],
    };
  }

  async listFourProducts(profile_id: string, knex = this.knex) {
    const data = await knex
      .with('ranked_products', (qb) => {
        qb.select([
          'mp.*',
          knex.raw('COALESCE(c.count, 0) AS count'),
          knex.raw('CAST(mp.price AS INTEGER) AS price'),
          knex.raw(
            'ROW_NUMBER() OVER (PARTITION BY mp.market_id ORDER BY m.sort_number, mp.sort_number) AS rn',
          ),
        ])
          .from('gamification.markets AS m')
          .leftJoin(
            'gamification.market_products AS mp',
            'mp.market_id',
            'm.id',
          )
          .leftJoin('gamification.cart AS c', function () {
            this.on('c.product_id', '=', 'mp.id').andOn(
              'c.profile_id',
              '=',
              knex.raw('?', [profile_id]),
            );
          })
          .whereNull('mp.deleted_at')
          .whereNull('m.deleted_at')
          .andWhere('mp.remaining_count', '>', 0)
          .orderBy('m.sort_number')
          .orderBy('mp.sort_number');
      })
      .select('*')
      .from('ranked_products')
      .where('rn', 1)
      .limit(4);

    return {
      data,
    };
  }

  async findMy(
    dto: FindMyProductsDto,
    knex = this.knex,
  ): Promise<IFindAllProduct> {
    const { limit = 10, page = 1 } = dto;
    const innerQuery = knex(`${this.table} as p`)
      .select('p.*')
      .join(`${this.relationToProfile} as rp`, 'rp.product_id', 'p.id')
      .where('rp.profile_id', dto.profile_id)
      .limit(limit)
      .offset((page - 1) * limit)
      .as('c');
    const [{ total, data }] = await knex
      .select([
        knex.raw(
          '(SELECT COUNT(id) FROM ?? WHERE deleted_at is null) AS total',
          this.table,
        ),
        knex.raw('jsonb_agg(c.*) AS data'),
      ])
      .from(innerQuery);
    return { total: +total, data };
  }

  async findOneWithCartCount(id: string, knex = this.knex) {
    return await knex('gamification.market_products as mp')
      .leftJoin('gamification.cart as c', 'c.product_id', 'mp.id')
      .select('mp.*', 'c.count')
      .where('mp.id', '673fa45aa220ed1c4b634261')
      .whereNull('c.deleted_at')
      .whereNull('mp.deleted_at');
  }

  async findOne(id: string, knex = this.knex): Promise<ProductEntity> {
    return await knex
      .select(['*', knex.raw('CAST(price AS INTEGER)')])
      .from(this.table)
      .where('id', id)
      .andWhere('deleted_at', null)
      .first();
  }

  async update(id: string, dto: UpdateProductDto, knex = this.knex) {
    const [data] = await knex(this.table)
      .update({
        ...dto,
        updated_at: new Date(),
      })
      .where('id', id)
      .andWhere('deleted_at', null)
      .returning('*');
    return data;
  }

  async updateSorting(
    id: string,
    data: UpdateProductDto,
    knex = this.knex,
  ): Promise<ProductEntity> {
    const trx = await knex.transaction();

    try {
      const selectedItem = await trx(this.table)
        .where('id', id)
        .andWhere('deleted_at', null)
        .andWhere('market_id', data.market_id)
        .first();

      if (!selectedItem) {
        throw new Error('Item not found');
      }

      const currentSortNumber = selectedItem.sort_number;
      const newSortNumber = data.sort_number;

      if (!newSortNumber || currentSortNumber === newSortNumber) {
        const [updatedMarket] = await trx(this.table)
          .update({
            ...data,
            updated_at: new Date(),
          })
          .where('id', id)
          .andWhere('deleted_at', null)
          .returning('*');
        await trx.commit();
        return updatedMarket;
      }

      if (newSortNumber > currentSortNumber) {
        await trx(this.table)
          .whereBetween('sort_number', [currentSortNumber + 1, newSortNumber])
          .andWhere('deleted_at', null)
          .andWhere('market_id', data.market_id)
          .decrement('sort_number', 1);
      } else if (newSortNumber < currentSortNumber) {
        await trx(this.table)
          .whereBetween('sort_number', [newSortNumber, currentSortNumber - 1])
          .andWhere('deleted_at', null)
          .andWhere('market_id', data.market_id)
          .increment('sort_number', 1);
      }

      const [updatedMarket] = await trx(this.table)
        .update({
          ...data,
          sort_number: newSortNumber,
          updated_at: new Date(),
        })
        .where('id', id)
        .andWhere('deleted_at', null)
        .returning('*');

      await trx.commit();
      return updatedMarket;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async delete(id: string, knex = this.knex): Promise<void> {
    await knex(this.table)
      .update({
        deleted_at: new Date(),
        updated_at: new Date(),
      })
      .where('id', id)
      .andWhere('deleted_at', null);
  }

  async getConnectionToProfile(
    profileId: string,
    productId: string,
    knex = this.knex,
  ) {
    return await knex
      .select('*')
      .from(this.relationToProfile)
      .where('profile_id', profileId)
      .andWhere('product_id', productId)
      .first();
  }

  async connectToProfile(
    profileId: string,
    productId: string,
    knex = this.knex,
  ) {
    return await knex
      .insert({ profile_id: profileId, product_id: productId })
      .into(this.relationToProfile)
      .returning('*');
  }

  async listByMarket(marketId: string) {
    return await this.knex
      .select('*')
      .from(this.table)
      .where('market_id', marketId)
      .andWhere('deleted_at', null);
  }

  async findConnectionToProfile(profileId: string, productId: string) {
    return await this.knex
      .select('*')
      .from(this.relationToProfile)
      .where('profile_id', profileId)
      .andWhere('product_id', productId)
      .andWhere('deleted_at', null)
      .first();
  }
}
