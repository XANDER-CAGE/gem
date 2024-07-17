import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductReviewsRepo } from './repo/product-reviews.repo';
import {
  ICreateProductReview,
  IFindAllProductReview,
  IUpdateProductReview,
} from './interface/product-reviews.interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';
// import { StudentsService } from '../students/students.service';
import { MarketService } from '../market/market.service';

@Injectable()
export class ProductReviewsService {
  @Inject() private readonly productReviewRepo: ProductReviewsRepo;
  // @Inject() private readonly studentService: StudentsService;
  @Inject() private readonly productService: MarketService;

  async create(dto: ICreateProductReview) {
    const { product_id: productId } = dto;
    // const student = await this.studentService.findOne(studentId);
    const product = await this.productService.findOne(productId);
    // if (!student) throw new NotFoundException('Student does not exist');
    if (!product) throw new NotFoundException('Product does not exist');
    return this.productReviewRepo.create(dto);
  }

  async findAll(dto: PaginationDto): Promise<IFindAllProductReview> {
    return await this.productReviewRepo.findAll(dto);
  }

  findOne(id: string) {
    return this.productReviewRepo.findOne(id);
  }

  async update(id: string, dto: IUpdateProductReview) {
    const { product_id: productId } = dto;
    // if (studentId) {
    // const student = await this.studentService.findOne(studentId);
    // if (!student) throw new NotFoundException('Student does not exist');
    // }
    if (productId) {
      const product = await this.productService.findOne(productId);
      if (!product) throw new NotFoundException('Student does not exist');
    }
    return this.productReviewRepo.update(id, dto);
  }

  remove(id: string) {
    return this.productReviewRepo.deleteOne(id);
  }
}
