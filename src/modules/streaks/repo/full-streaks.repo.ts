import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class FullStreaksRepo {
  private table = 'full_streaks';

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async list() {
    try {
      return await this.knex(this.table).select('*');
    } catch (error) {
      throw new Error(`Error retrieving full-streaks: ${error.message}`);
    }
  }

  async getOne(id: string) {
    try {
      return await this.knex(this.table).where('id', id).first();
    } catch (error) {
      throw new Error(
        `Error retrieving full-streaks with id ${id}: ${error.message}`,
      );
    }
  }

  async create(data: any) {
    try {
      const [newFullStreak] = await this.knex(this.table)
        .insert(data)
        .returning('*');
      return newFullStreak;
    } catch (error) {
      throw new Error(`Error creating full-streaks: ${error.message}`);
    }
  }

  async update(id: string, data: any) {
    try {
      const [updateFullStreak] = await this.knex(this.table)
        .where('id', id)
        .update(data)
        .returning('*');
      return updateFullStreak;
    } catch (error) {
      throw new Error(`Error updating updateFullStreak with id ${id}: ${error.message}`);
    }
  }

  async deleteOne(id: string) {
    try {
      await this.knex(this.table).where('id', id).del();
      return { message: `Course with id ${id} deleted successfully` };
    } catch (error) {
      throw new Error(
        `Error deleting updateFullStreak with id ${id}: ${error.message}`,
      );
    }
  }
}
