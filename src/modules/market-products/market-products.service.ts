import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepo } from './repo/market-products.repo';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MarketCategoriesService } from '../market-categories/market-categories.service';
import { MarketService } from '../market/market.service';
import { CreateProductDto } from './dto/create-market-product.dto';
import { IFindAllProduct } from './interface/market-product.interface';
import { UpdateProductDto } from './dto/update-market-product.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepo: ProductRepo,
    private readonly categoryService: MarketCategoriesService,
    private readonly marketService: MarketService,
    @InjectConnection() private readonly knex: Knex,
  ) {}

  async create(dto: CreateProductDto) {
    const { market_id: marketId, category_id: categoryId } = dto;
    if (categoryId) {
      const category = await this.categoryService.findOne(categoryId);
      if (!category) throw new NotFoundException('Category not found');
    }
    const market = await this.marketService.findOne(marketId);
    if (!market) throw new NotFoundException('Category not found');
    return this.productRepo.create(dto);
  }

  async findAll(dto: PaginationDto): Promise<IFindAllProduct> {
    return this.productRepo.findAll(dto);
  }

  async findOne(id: string) {
    return await this.productRepo.findOne(id);
  }

  async update(id: string, dto: UpdateProductDto) {
    const { market_id: marketId, category_id: categoryId } = dto;
    if (categoryId) {
      const category = await this.categoryService.findOne(categoryId);
      if (!category) throw new NotFoundException('Category not found');
    }
    if (marketId) {
      const market = await this.marketService.findOne(marketId);
      if (!market) throw new NotFoundException('Category not found');
    }
    return this.productRepo.update(id, dto);
  }

  async remove(id: string) {
    await this.productRepo.delete(id);
  }

  async connectToProfile(
    profileId: string,
    productId: string,
    knex = this.knex,
  ) {
    const connection = await this.productRepo.getConnectionToProfile(
      profileId,
      productId,
      knex,
    );
    if (connection) return connection;
    return await this.productRepo.connectToProfile(profileId, productId, knex);
  }
}
