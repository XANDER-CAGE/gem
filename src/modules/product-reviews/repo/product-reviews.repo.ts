import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { IFindAllProductReview } from '../interface/product-review.interface';
import { CreateProductReviewDto } from '../dto/create-product-review.dto';
import { UpdateProductReviewDto } from '../dto/update-product-review.dto';
import { FindAllProductReviewDto } from '../dto/find-all.product-review.dto';

@Injectable()
export class ProductReviewsRepo {
  private table = 'product_reviews';

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findAll(
    dto: FindAllProductReviewDto,
    knex = this.knex,
  ): Promise<IFindAllProductReview> {
    const { limit = 10, page = 1 } = dto;
    const innerQuery = knex(this.table)
      .select('*')
      .where('deleted_at', null)
      .andWhere(function () {
        if (dto.product_id) {
          this.where('product_id', dto.product_id);
        }
      })
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

  async findOne(id: string, knex = this.knex) {
    return await knex
      .select('*')
      .from(this.table)
      .where('id', id)
      .andWhere('deleted_at', null)
      .first();
  }
  async create(
    data: CreateProductReviewDto,
    profileId: string,
    knex = this.knex,
  ) {
    const review = await knex(this.table)
      .insert({ ...data, profile_id: profileId })
      .returning('*');
    return review;
  }

  async update(id: string, data: UpdateProductReviewDto, knex = this.knex) {
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
