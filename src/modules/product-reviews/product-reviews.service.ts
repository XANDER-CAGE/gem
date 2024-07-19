import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductReviewsRepo } from './repo/product-reviews.repo';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ProductsService } from '../market-products/market-products.service';
import { StudentProfilesService } from '../student-profiles/student-profiles.service';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { IFindAllProductReview } from './interface/product-review.interface';
import { UpdateProductReviewDto } from './dto/update-prdouct-review.dto';

@Injectable()
export class ProductReviewsService {
  @Inject() private readonly productReviewRepo: ProductReviewsRepo;
  @Inject() private readonly productService: ProductsService;
  @Inject() private readonly profileService: StudentProfilesService;

  async create(dto: CreateProductReviewDto) {
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

  async findOne(id: string) {
    return await this.productReviewRepo.findOne(id);
  }

  async update(id: string, dto: UpdateProductReviewDto) {
    const { product_id: productId, profile_id: profileId } = dto;
    const product = await this.productService.findOne(productId);
    if (!product) throw new NotFoundException('Product does not exist');

    const profile = await this.profileService.findOne(profileId);
    if (!profile) throw new NotFoundException('Profile does not exist');

    return this.productReviewRepo.update(id, dto);
  }

  async remove(id: string) {
    await this.productReviewRepo.deleteOne(id);
  }
}
