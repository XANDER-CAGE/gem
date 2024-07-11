import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class ProductReviewsRepo {
  private table = 'product_reviews';

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async list() {
    try {
      return await this.knex(this.table).select('*');
    } catch (error) {
      throw new Error(`Error retrieving product-review: ${error.message}`);
    }
  }

  async getOne(id: string) {
    try {
      return await this.knex(this.table).where('id', id).first();
    } catch (error) {
      throw new Error(
        `Error retrieving product-review with id ${id}: ${error.message}`,
      );
    }
  }

  async create(data: any) {
    try {
      const [newProductReview] = await this.knex(this.table)
        .insert(data)
        .returning('*');
      return newProductReview;
    } catch (error) {
      throw new Error(`Error creating product-review: ${error.message}`);
    }
  }

  async update(id: string, data: any) {
    try {
      const [newProductReview] = await this.knex(this.table)
        .where('id', id)
        .update(data)
        .returning('*');
      return newProductReview;
    } catch (error) {
      throw new Error(
        `Error updating product-review with id ${id}: ${error.message}`,
      );
    }
  }

  async deleteOne(id: string) {
    try {
      await this.knex(this.table).where('id', id).del();
      return { message: `Product-review with id ${id} deleted successfully` };
    } catch (error) {
      throw new Error(
        `Error deleting product-review with id ${id}: ${error.message}`,
      );
    }
  }
}
