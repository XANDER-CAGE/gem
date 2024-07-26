import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateProductDto } from '../dto/create-market-product.dto';
import { ProductEntity } from '../entity/product.interface';
import { IFindAllProduct } from '../interface/market-product.interface';
import { UpdateProductDto } from '../dto/update-market-product.dto';
import { tableName } from 'src/common/var/table-name.var';

@Injectable()
export class ProductRepo {
  private readonly table = tableName.marketProducts;
  private readonly relationToProfile = tableName.profilesM2MProducts;

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(
    dto: CreateProductDto,
    knex = this.knex,
  ): Promise<ProductEntity> {
    const [data] = await knex
      .insert({
        ...dto,
      })
      .into(this.table)
      .returning('*');
    return data;
  }

  async findAll(
    dto: PaginationDto,
    knex = this.knex,
  ): Promise<IFindAllProduct> {
    const { limit = 10, page = 1 } = dto;
    const innerQuery = knex(this.table)
      .select('*')
      .where('deleted_at', null)
      .limit(limit)
      .offset((page - 1) * limit)
      .as('c');
    const [{ total, data }] = await knex
      .select([
        knex.raw(
          '(SELECT COUNT(id) FROM ?? WHERE deleted_at is null) AS total',
          this.table,
        ),
        knex.raw('jsonb_agg(c.*) AS data'),
      ])
      .from(innerQuery);
    return { total: +total, data };
  }

  async findOne(id: string, knex = this.knex): Promise<ProductEntity> {
    return await knex
      .select('*')
      .from(this.table)
      .where('id', id)
      .andWhere('deleted_at', null)
      .first();
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    knex = this.knex,
  ): Promise<ProductEntity> {
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

  async getConnectionToProfile(
    profileId: string,
    productId: string,
    knex = this.knex,
  ) {
    return await knex
      .select('*')
      .from(this.relationToProfile)
      .where('profile_id', profileId)
      .andWhere('product_id', productId)
      .first();
  }

  async connectToProfile(
    profileId: string,
    productId: string,
    knex = this.knex,
  ) {
    return await knex
      .insert({ profile_id: profileId, product_id: productId })
      .into(this.relationToProfile)
      .returning('*');
  }
}
