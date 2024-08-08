import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepo } from './repo/market-products.repo';
import { MarketService } from '../market/market.service';
import { CreateProductDto } from './dto/create-market-product.dto';
import { IFindAllProduct } from './interface/market-product.interface';
import { UpdateProductDto } from './dto/update-market-product.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { FindAllProductsDto } from './dto/find-all.product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepo: ProductRepo,
    private readonly marketService: MarketService,
    @InjectConnection() private readonly knex: Knex,
  ) {}

  async create(dto: CreateProductDto) {
    const { market_id: marketId } = dto;
    const market = await this.marketService.findOne(marketId);
    if (!market) throw new NotFoundException('Category not found');
    return this.productRepo.create(dto);
  }

  async findAll(dto: FindAllProductsDto): Promise<IFindAllProduct> {
    return this.productRepo.findAll(dto);
  }

  async findOne(id: string) {
    return await this.productRepo.findOne(id);
  }

  async update(id: string, dto: UpdateProductDto, knex = this.knex) {
    const { market_id: marketId } = dto;
    if (marketId) {
      const market = await this.marketService.findOne(marketId);
      if (!market) throw new NotFoundException('Market not found');
    }
    return this.productRepo.update(id, dto, knex);
  }

  async remove(id: string) {
    await this.productRepo.delete(id);
  }

  async connectToProfile(
    profileId: string,
    productId: string,
    knex = this.knex,
  ) {
    return await this.productRepo.connectToProfile(profileId, productId, knex);
  }

  async listByMarket(marketId: string) {
    return await this.productRepo.listByMarket(marketId);
  }

  async findConnectionToProfile(profileId: string, productId: string) {
    return await this.productRepo.findConnectionToProfile(profileId, productId);
  }
}
