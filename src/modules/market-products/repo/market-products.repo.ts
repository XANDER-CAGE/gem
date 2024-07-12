import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class MarketProductsRepo {
  private table = 'market_products';

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async list() {
    try {
      return await this.knex(this.table).select('*');
    } catch (error) {
      throw new Error(`Error retrieving market-products: ${error.message}`);
    }
  }

  async getOne(id: string) {
    try {
      return await this.knex(this.table).where('id', id).first();
    } catch (error) {
      throw new Error(
        `Error retrieving market-products with id ${id}: ${error.message}`,
      );
    }
  }

  async create(data: any) {
    try {
      const [newMarketProduct] = await this.knex(this.table)
        .insert(data)
        .returning('*');
      return newMarketProduct;
    } catch (error) {
      throw new Error(`Error creating market-products: ${error.message}`);
    }
  }

  async update(id: string, data: any) {
    try {
      const [updatedMarketProduct] = await this.knex(this.table)
        .where('id', id)
        .update(data)
        .returning('*');
      return updatedMarketProduct;
    } catch (error) {
      throw new Error(
        `Error updating market-products with id ${id}: ${error.message}`,
      );
    }
  }

  async deleteOne(id: string) {
    try {
      await this.knex(this.table).where('id', id).del();
      return { message: `Market-products with id ${id} deleted successfully` };
    } catch (error) {
      throw new Error(
        `Error deleting market-products with id ${id}: ${error.message}`,
      );
    }
  }
}
