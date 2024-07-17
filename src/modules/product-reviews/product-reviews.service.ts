import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductReviewsRepo } from './repo/product-reviews.repo';
import {
  ICreateProductReview,
  IFindAllProductReview,
  IUpdateProductReview,
} from './interface/product-reviews.interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ProductsService } from '../market-products/market-products.service';
import { StudentProfilesService } from '../student-profiles/student-profiles.service';

@Injectable()
export class ProductReviewsService {
  @Inject() private readonly productReviewRepo: ProductReviewsRepo;
  @Inject() private readonly productService: ProductsService;
  @Inject() private readonly profileService: StudentProfilesService;

  async create(dto: ICreateProductReview) {
    const { product_id: productId, profile_id: profileId } = dto;
    const product = await this.productService.findOne(productId);
    if (!product) throw new NotFoundException('Product does not exist');

    const profile = await this.profileService.findOne(profileId);
    if (!profile) throw new NotFoundException('Profile does not exist');

    return this.productReviewRepo.create(dto);
  }

  async findAll(dto: PaginationDto): Promise<IFindAllProductReview> {
    return await this.productReviewRepo.findAll(dto);
  }

  findOne(id: string) {
    return this.productReviewRepo.findOne(id);
  }

  async update(id: string, dto: IUpdateProductReview) {
    const { product_id: productId, profile_id: profileId } = dto;
    const product = await this.productService.findOne(productId);
    if (!product) throw new NotFoundException('Product does not exist');

    const profile = await this.profileService.findOne(profileId);
    if (!profile) throw new NotFoundException('Profile does not exist');

    return this.productReviewRepo.update(id, dto);
  }

  remove(id: string) {
    return this.productReviewRepo.deleteOne(id);
  }
}
