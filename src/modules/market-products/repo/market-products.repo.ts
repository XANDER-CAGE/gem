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
      .where('m.category_id', '6735be34c6adfa1b87988dfe')
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

  async defaultAppearanceAvatars(
    dto: FindAllCategoriesDto,
    profile_id: string,
    knex = this.knex,
  ) {
    const { limit = 10, page = 1 } = dto;

    const profile_data = await knex('gamification.student_profiles as sp')
      .leftJoin('students as s', 's.id', 'sp.student_id')
      .select(knex.raw("COALESCE(s.gender, 'male') as gender"), 's.school_id')
      .where('sp.id', profile_id)
      .andWhere('s.is_deleted', false)
      .first();

    if (!profile_data) {
      throw new Error('Profile data not found');
    }

    const genderProductId =
      profile_data.gender === 'male'
        ? '6756d1757875751160b5c12a'
        : '6756d1897bab2a1160b4326f';

    const schoolProductMap = {
      '648d8982548f561eca35d167': '6756d210cf81441160e94db4',
      '648d89c03c662b1eca0cefad': '6756d1ab927598116057f6fc',
      '648d89b0934cee1eca8f1622': '6756d22a2a7b851160d4cd3d',
      '648d88a641e2f91eca2ea59e': '6756d23e37584311609dc1d6',
    };
    const schoolProductId = schoolProductMap[profile_data.school_id];

    const allowedProductIds = [genderProductId, schoolProductId].filter(
      Boolean,
    );

    const selectedProducts = await knex('gamification.student_profiles as sp')
      .select('sp.ava', 'sp.streak_background', 'sp.frame', 'sp.app_icon')
      .whereNull('sp.deleted_at')
      .andWhere('sp.id', profile_id);

    const innerQuery = knex
      .with(
        'products_by_market',
        knex('gamification.market_products as mp')
          .select(
            'm.name as category',
            knex.raw(
              `
          json_agg(
            jsonb_build_object(
              'id', mp.id,
              'name', mp.name,
              'description', mp.description,
              'avatar', mp.avatar,
              'type', mp.type,
              'price', mp.price,
              'purchased', 
                case 
                  when mp.is_free = true then true
                  when t.id is not null then true
                  else false 
                end,
              'selected', 
                case 
                  when mp.id = ANY(?) then true
                  else false
                end
            ) order by mp.is_free desc, mp.sort_number
          ) filter (where mp.remaining_count > 0) as products
        `,
              [
                (await selectedProducts)
                  .map((sp) => sp.ava)
                  .concat(
                    (await selectedProducts).map((sp) => sp.streak_background),
                    (await selectedProducts).map((sp) => sp.frame),
                    (await selectedProducts).map((sp) => sp.app_icon),
                  ),
              ],
            ),
          )
          .leftJoin('gamification.markets as m', 'mp.market_id', 'm.id')
          .leftJoin(
            knex('gamification.transactions as t')
              .select('*')
              .where({
                profile_id: profile_id,
                deleted_at: null,
              })
              .as('t'),
            function () {
              this.on('t.product_id', '=', 'mp.id');
            },
          )
          .where({
            'mp.deleted_at': null,
            'm.deleted_at': null,
            'mp.type': 'appearance',
          })
          .whereIn('mp.id', allowedProductIds)
          .groupBy('m.name', 'm.sort_number'),
      )
      .select('*')
      .from('products_by_market')
      .where(knex.raw('json_array_length(products) > 0'))
      .orderBy('category')
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

  async listWithAppearanceCategories(
    dto: FindAllCategoriesDto,
    profile_id: string,
    knex = this.knex,
  ) {
    const { limit = 10, page = 1 } = dto;

    const selectedProducts = knex('gamification.student_profiles as sp')
      .select('sp.ava', 'sp.streak_background', 'sp.frame', 'sp.app_icon')
      .whereNull('sp.deleted_at')
      .andWhere('sp.id', profile_id);

    const excludedIds = [
      '6756d1757875751160b5c12a',
      '6756d1897bab2a1160b4326f',
      '6756d210cf81441160e94db4',
      '6756d1ab927598116057f6fc',
      '6756d22a2a7b851160d4cd3d',
      '6756d23e37584311609dc1d6',
    ];

    const innerQuery = knex
      .with(
        'products_by_market',
        knex('gamification.market_products as mp')
          .select(
            'm.name as category',
            'm.sort_number',
            knex.raw(
              `
        json_agg(
          jsonb_build_object(
            'id', mp.id,
            'name', mp.name,
            'description', mp.description,
            'avatar', mp.avatar,
            'type', mp.type,
            'price', mp.price,
            'purchased', 
              case 
                when mp.is_free = true then true
                when t.id is not null then true
                else false 
              end,
            'selected', 
              case 
                when mp.id = ANY(?) then true
                else false
              end
          ) order by mp.is_free desc, mp.sort_number
        ) filter (where mp.remaining_count > 0) as products
      `,
              [
                (await selectedProducts)
                  .map((sp) => sp.ava)
                  .concat(
                    (await selectedProducts).map((sp) => sp.streak_background),
                    (await selectedProducts).map((sp) => sp.frame),
                    (await selectedProducts).map((sp) => sp.app_icon),
                  ),
              ],
            ),
          )
          .leftJoin('gamification.markets as m', 'mp.market_id', 'm.id')
          .leftJoin(
            knex('gamification.transactions as t')
              .select('*')
              .where({
                profile_id: profile_id,
                deleted_at: null,
              })
              .as('t'),
            function () {
              this.on('t.product_id', '=', 'mp.id');
            },
          )
          .where({
            'mp.deleted_at': null,
            'm.deleted_at': null,
            'mp.type': 'appearance',
          })
          .whereNotIn('mp.id', excludedIds)
          .groupBy('m.name', 'm.sort_number')
          .orderBy('m.sort_number'),
      )
      .select('*')
      .from('products_by_market')
      .where(knex.raw('json_array_length(products) > 0'))
      .orderBy('sort_number')
      .limit(limit)
      .offset((page - 1) * limit)
      .as('c');

    const [{ total }] = await knex('gamification.market_products')
      .whereNull('deleted_at')
      .whereNotIn('id', excludedIds)
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
          .where('m.category_id', '6735be34c6adfa1b87988dfe')
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

  async findOneWithCartCount(id: string, profile_id: string, knex = this.knex) {
    const product = await knex('gamification.market_products as mp')
      .select(
        'mp.*',
        knex.raw('CAST(mp.price AS INTEGER) AS price'),
        knex.raw(`
      CASE 
        WHEN mp.created_at >= now() - interval '3 days' THEN true
        ELSE false
      END AS is_new
    `),
      )
      .where('mp.id', id)
      .whereNull('mp.deleted_at')
      .first();

    if (!product) {
      return null;
    }

    const cart = await knex('gamification.cart as c')
      .select('*')
      .where({
        'c.product_id': id,
        'c.profile_id': profile_id,
      })
      .whereNull('c.deleted_at')
      .first();

    product.count = cart ? Number(cart.count) : 0;

    return product;
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
