import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class StudentProfilesRepo {
  private table = 'student_profiles';

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async list() {
    try {
      return await this.knex(this.table).select('*');
    } catch (error) {
      throw new Error(`Error retrieving student profile: ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      return await this.knex(this.table).where('id', id).first();
    } catch (error) {
      throw new Error(
        `Error retrieving course with id ${id}: ${error.message}`,
      );
    }
  }

  async create(data: any) {
    try {
      const [newStudentsProfile] = await this.knex(this.table)
        .insert(data)
        .returning('*');
      return newStudentsProfile;
    } catch (error) {
      throw new Error(`Error creating student profile: ${error.message}`);
    }
  }

  async update(id: string, data: any) {
    try {
      const [updatedCourse] = await this.knex(this.table)
        .where('id', id)
        .update(data)
        .returning('*');
      return updatedCourse;
    } catch (error) {
      throw new Error(`Error updating student profile with id ${id}: ${error.message}`);
    }
  }

  async deleteOne(id: string) {
    try {
      await this.knex(this.table).where('id', id).del();
      return { message: `Student profile with id ${id} deleted successfully` };
    } catch (error) {
      throw new Error(`Error deleting student profile with id ${id}: ${error.message}`);
    }
  }
}
