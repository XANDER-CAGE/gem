import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductReviewsRepo } from './repo/product-reviews.repo';
import { ProductsService } from '../market-products/market-products.service';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { IFindAllProductReview } from './interface/product-review.interface';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';
import { StudentProfileEntity } from '../student-profiles/entity/student-profile.entity';
import { FindAllProductReviewDto } from './dto/find-all.product-review.dto';

@Injectable()
export class ProductReviewsService {
  @Inject() private readonly productReviewRepo: ProductReviewsRepo;
  @Inject() private readonly productService: ProductsService;

  async create(dto: CreateProductReviewDto, profile: StudentProfileEntity) {
    const { product_id: productId } = dto;
    const product = await this.productService.findOne(productId);
    if (!product) throw new NotFoundException('Product does not exist');
    return this.productReviewRepo.create(dto, profile.id);
  }

  async findAll(dto: FindAllProductReviewDto): Promise<IFindAllProductReview> {
    return await this.productReviewRepo.findAll(dto);
  }

  async findOne(id: string) {
    return await this.productReviewRepo.findOne(id);
  }

  async update(id: string, dto: UpdateProductReviewDto) {
    const { product_id: productId } = dto;
    const product = await this.productService.findOne(productId);
    if (!product) throw new NotFoundException('Product does not exist');
    return this.productReviewRepo.update(id, dto);
  }

  async remove(id: string) {
    await this.productReviewRepo.deleteOne(id);
  }
}
