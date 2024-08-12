import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { IFiles } from '../interfaces/file.interface';

@Injectable()
export class FileRepo {
  private table = `files`;

  constructor(@InjectConnection() public knex: Knex) {}

  async saveFile(payload: IFiles, knex = this.knex): Promise<IFiles> {
    const [file] = await knex.insert(payload).into(this.table).returning('*');
    return file;
  }

  async getById(id: string, knex = this.knex): Promise<IFiles> {
    return knex
      .select('*')
      .from(this.table)
      .where('id', id)
      .where('is_deleted', false)
      .first();
  }
}
