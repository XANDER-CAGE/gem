import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { tableName } from 'src/common/var/table-name.var';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class AssignmentRepo {
  private readonly table = tableName.assignment;
  private readonly fileTable = tableName.files;

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findAll(dto: PaginationDto, profileId: string, knex = this.knex) {
    const { limit = 10, page = 1 } = dto;
    const innerQuery = knex(`${this.table} as a`)
      .select('f.*')
      .whereNull('deleted_at')
      .andWhere('profile_id', profileId)
      .leftJoin(`${this.fileTable} as f`, function () {
        this.on('f.id', 'a.file_id').andOn(knex.raw('f.is_deleted is false'));
      })
      .limit(limit)
      .offset((page - 1) * limit)
      .as('c');
    const [{ total, data }] = await knex
      .select([
        knex.raw(
          `(SELECT COUNT(id) FROM ?? WHERE deleted_at is null and profile_id = '${profileId}') AS total`,
          this.table,
        ),
        knex.raw('jsonb_agg(c.*) AS data'),
      ])
      .from(innerQuery);

    return { total: +total, data };
  }

  async create(fileId: string, profileId: string, knex = this.knex) {
    const [data] = await knex(this.table)
      .insert({
        file_id: fileId,
        profile_id: profileId,
      })
      .returning('*');
    return data;
  }
}
