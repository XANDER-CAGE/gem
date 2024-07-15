import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductReviewsRepo } from './repo/product-reviews.repo';
import {
  ICreateProductReview,
  IFindAllProductReview,
  IUpdateProductReview,
} from './interface/product-reviews.interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { StudentsService } from '../students/students.service';
import { MarketService } from '../market/market.service';

@Injectable()
export class ProductReviewsService {
  @Inject() private readonly productReviewRepo: ProductReviewsRepo;
  @Inject() private readonly studentService: StudentsService;
  @Inject() private readonly productService: MarketService;

  async create(createProductReview: ICreateProductReview) {
    const { student_id, product_id } = createProductReview;
    if (student_id && product_id) {
      const student_exist = await this.studentService.findOne(student_id);
      const product_exist = await this.productService.findOne(product_id);
      if (!student_exist || !product_exist) {
        throw new NotFoundException(
          'This (student or product) id does not exist',
        );
      }
    }
    return this.productReviewRepo.create(createProductReview);
  }

  async findAll(
    findAllProductReview: PaginationDto,
  ): Promise<IFindAllProductReview> {
    return await this.productReviewRepo.findAll(findAllProductReview);
  }

  findOne(id: string) {
    return this.productReviewRepo.findOne(id);
  }

  async update(id: string, updateProductReview: IUpdateProductReview) {
    const { student_id, product_id } = updateProductReview;
    if (student_id && product_id) {
      const student_exist = await this.studentService.findOne(student_id);
      const product_exist = await this.productService.findOne(product_id);
      if (!student_exist || !product_exist) {
        throw new NotFoundException(
          'This (student or product) id does not exist',
        );
      }
    }
    return this.productReviewRepo.update(id, updateProductReview);
  }

  remove(id: string) {
    return this.productReviewRepo.deleteOne(id);
  }
}
