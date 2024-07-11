import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class SpendingsRepo {
  private table = 'spendings';

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async list() {
    try {
      return await this.knex(this.table).select('*');
    } catch (error) {
      throw new Error(`Error retrieving spending: ${error.message}`);
    }
  }

  async getOne(id: string) {
    try {
      return await this.knex(this.table).where('id', id).first();
    } catch (error) {
      throw new Error(
        `Error retrieving spending with id ${id}: ${error.message}`,
      );
    }
  }

  async create(data: any) {
    try {
      const [newSpending] = await this.knex(this.table)
        .insert(data)
        .returning('*');
      return newSpending;
    } catch (error) {
      throw new Error(`Error creating spending: ${error.message}`);
    }
  }

  async update(id: string, data: any) {
    try {
      const [updateSpending] = await this.knex(this.table)
        .where('id', id)
        .update(data)
        .returning('*');
      return updateSpending;
    } catch (error) {
      throw new Error(`Error updating spending with id ${id}: ${error.message}`);
    }
  }

  async deleteOne(id: string) {
    try {
      await this.knex(this.table).where('id', id).del();
      return { message: `Spending with id ${id} deleted successfully` };
    } catch (error) {
      throw new Error(`Error deleting spending with id ${id}: ${error.message}`);
    }
  }
}
