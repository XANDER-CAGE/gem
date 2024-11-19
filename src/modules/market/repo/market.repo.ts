import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { IFindAllMarkets } from '../interface/find_all.interface';
import { CreateMarketDto } from '../dto/create-market.dto';
import { UpdateMarketDto } from '../dto/update-market.dto';
import { FindAllMarketDto } from '../dto/find-all.market.dto';
import { tableName } from 'src/common/var/table-name.var';

@Injectable()
export class MarketRepo {
  private readonly table = tableName.markets;
  private readonly products = tableName.marketProducts;
  private readonly productReviews = tableName.productReviews;

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findAll(
    dto: FindAllMarketDto,
    knex = this.knex,
  ): Promise<IFindAllMarkets> {
    const { limit = 10, page = 1 } = dto;
    const innerQuery = knex(`${this.table} as m`)
      .select(
        'm.*',
        knex.raw('coalesce(avg(pr.rate), 5)::double precision as rating'),
      )
      .where('m.deleted_at', null)
      .leftJoin(`${this.products} as p`, function () {
        this.on('p.market_id', 'm.id').andOn(knex.raw('p.deleted_at is null'));
      })
      .leftJoin(`${this.productReviews} as pr`, function () {
        this.on('pr.product_id', 'p.id').andOn(
          knex.raw('pr.deleted_at is null'),
        );
      })
      .andWhere(function () {
        if (dto.category_id) {
          this.where('m.category_id', dto.category_id);
        }
      });

    if (dto.search) {
      innerQuery.where(
        knex.raw('LOWER(m.name)'),
        'like',
        `%${dto.search.toLowerCase()}%`,
      );
    }
    innerQuery
      .limit(limit)
      .offset((page - 1) * limit)
      .groupBy('m.id')
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

  async findOne(id: string, knex = this.knex) {
    return await knex
      .select(
        'm.*',
        knex.raw('coalesce(avg(pr.rate), 5)::double precision as rating'),
      )
      .from(`${this.table} as m`)
      .leftJoin(`${this.products} as p`, function () {
        this.on('p.market_id', 'm.id').andOn(knex.raw('p.deleted_at is null'));
      })
      .leftJoin(`${this.productReviews} as pr`, function () {
        this.on('pr.product_id', 'p.id').andOn(
          knex.raw('pr.deleted_at is null'),
        );
      })
      .where('m.id', id)
      .andWhere('m.deleted_at', null)
      .groupBy('m.id')
      .first();
  }

  async create(data: CreateMarketDto, knex = this.knex) {
    if (!data.sort_number) {
      const maxResult = await knex(`${this.table} as m`)
        .max('m.sort_number as max_sort_number')
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

  async update(id: string, data: UpdateMarketDto, knex = this.knex) {
    const trx = await knex.transaction();

    try {
      const selectedItem = await trx(this.table)
        .where('id', id)
        .andWhere('deleted_at', null)
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
          .decrement('sort_number', 1);
      } else if (newSortNumber < currentSortNumber) {
        await trx(this.table)
          .whereBetween('sort_number', [newSortNumber, currentSortNumber - 1])
          .andWhere('deleted_at', null)
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
