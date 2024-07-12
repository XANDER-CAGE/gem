import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class FullStreaksRepo {
  private table = 'streaks';

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async list() {
    try {
      return await this.knex(this.table).select('*');
    } catch (error) {
      throw new Error(`Error retrieving streaks: ${error.message}`);
    }
  }

  async getOne(id: string) {
    try {
      return await this.knex(this.table).where('id', id).first();
    } catch (error) {
      throw new Error(
        `Error retrieving streaks with id ${id}: ${error.message}`,
      );
    }
  }

  async create(data: any) {
    try {
      const [newStreak] = await this.knex(this.table)
        .insert(data)
        .returning('*');
      return newStreak;
    } catch (error) {
      throw new Error(`Error creating streaks: ${error.message}`);
    }
  }

  async update(id: string, data: any) {
    try {
      const [updateStreak] = await this.knex(this.table)
        .where('id', id)
        .update(data)
        .returning('*');
      return updateStreak;
    } catch (error) {
      throw new Error(
        `Error updating updateStreak with id ${id}: ${error.message}`,
      );
    }
  }

  async deleteOne(id: string) {
    try {
      await this.knex(this.table).where('id', id).del();
      return { message: `UpdateStreak with id ${id} deleted successfully` };
    } catch (error) {
      throw new Error(
        `Error deleting updateStreak with id ${id}: ${error.message}`,
      );
    }
  }
}
