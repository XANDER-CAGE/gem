import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';


@Injectable()
export class MarketCategoriesRepo {
  private table = 'market_categories';

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async list() {
    try {
      return await this.knex(this.table).select('*');
    } catch (error) {
      throw new Error(`Error retrieving market-category: ${error.message}`);
    }
  }

  async getOne(id: string) {
    try {
      return await this.knex(this.table).where('id', id).first();
    } catch (error) {
      throw new Error(
        `Error retrieving market-category with id ${id}: ${error.message}`,
      );
    }
  }

  async create(data: any) {
    try {
      const [newMarketCategory] = await this.knex(this.table)
        .insert(data)
        .returning('*');
      return newMarketCategory;
    } catch (error) {
      throw new Error(`Error creating market-category: ${error.message}`);
    }
  }

  async update(id: string, data: any) {
    try {
      const [updatedMarketCategory] = await this.knex(this.table)
        .where('id', id)
        .update(data)
        .returning('*');
      return updatedMarketCategory;
    } catch (error) {
      throw new Error(`Error updating market-category with id ${id}: ${error.message}`);
    }
  }

  async deleteOne(id: string) {
    try {
      await this.knex(this.table).where('id', id).del();
      return { message: `Market-category with id ${id} deleted successfully` };
    } catch (error) {
      throw new Error(`Error deleting market-category with id ${id}: ${error.message}`);
    }
  }
}
