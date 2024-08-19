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
      })
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
    const [res] = await knex(this.table).insert(data).returning('*');
    return res;
  }

  async update(id: string, data: UpdateMarketDto, knex = this.knex) {
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
