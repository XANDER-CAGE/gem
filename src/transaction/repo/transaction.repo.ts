import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import {
  CreateEarningDto,
  CreateSpendingDto,
  UpdateEarningDto,
  UpdateSpendingDto,
} from '../dto/create-transaction.dto';

export class TransactionRepo {
  private readonly table = 'transactions';
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(dto: CreateSpendingDto | CreateEarningDto, knex = this.knex) {
    const [data] = await knex
      .insert({
        ...dto,
      })
      .into(this.table)
      .returning('*');
    return data;
  }

  async findAll(knex = this.knex) {}

  async findOne(id: string, knex = this.knex) {
    return await knex
      .select('*')
      .from(this.table)
      .where('id', id)
      .andWhere('deleted_at', null)
      .first();
  }

  async update(
    id: string,
    dto: UpdateEarningDto | UpdateSpendingDto,
    knex = this.knex,
  ) {
    const [data] = await knex(this.table)
      .update({
        ...dto,
        updated_at: new Date(),
      })
      .where('id', id)
      .andWhere('deleted_at', null)
      .returning('*');
    return data;
  }

  async delete(id: string, knex = this.knex): Promise<void> {
    await knex(this.table)
      .update({
        deleted_at: new Date(),
        updated_at: new Date(),
      })
      .where('id', id)
      .andWhere('deleted_at', null);
  }
}
