import { Injectable } from '@nestjs/common';
import { CreateProductReviewDto, UpdateProductReviewDto } from './dto/product-reviews.dto';


@Injectable()
export class ProductReviewsService {
  create(createProductReviewDto: CreateProductReviewDto) {
    return 'This action adds a new productReview';
  }

  findAll() {
    return `This action returns all productReviews`;
  }

  findOne(id: string) {
    return `This action returns a #${id} productReview`;
  }

  update(id: string, updateProductReviewDto: UpdateProductReviewDto) {
    return `This action updates a #${id} productReview`;
  }

  remove(id: string) {
    return `This action removes a #${id} productReview`;
  }
}
