import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class StudentsRepo {
  private table = 'course';

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async list() {
    try {
      return await this.knex(this.table).select('*');
    } catch (error) {
      throw new Error(`Error retrieving courses: ${error.message}`);
    }
  }

  async getOne(id: number) {
    try {
      return await this.knex(this.table).where('id', id).first();
    } catch (error) {
      throw new Error(
        `Error retrieving course with id ${id}: ${error.message}`,
      );
    }
  }

  async create(course: any) {
    try {
      const [newCourse] = await this.knex(this.table)
        .insert(course)
        .returning('*');
      return newCourse;
    } catch (error) {
      throw new Error(`Error creating course: ${error.message}`);
    }
  }

  async update(id: number, course: any) {
    try {
      const [updatedCourse] = await this.knex(this.table)
        .where('id', id)
        .update(course)
        .returning('*');
      return updatedCourse;
    } catch (error) {
      throw new Error(`Error updating course with id ${id}: ${error.message}`);
    }
  }

  async deleteOne(id: number) {
    try {
      await this.knex(this.table).where('id', id).del();
      return { message: `Course with id ${id} deleted successfully` };
    } catch (error) {
      throw new Error(`Error deleting course with id ${id}: ${error.message}`);
    }
  }
}
