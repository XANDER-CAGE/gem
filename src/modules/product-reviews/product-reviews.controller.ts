import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductReviewsService } from './product-reviews.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { CreateProductReviewResponse } from './response/create-product-review.response';
import { ErrorApiResponse } from 'src/common/response-class/error.response';
import { DeleteApiResponse } from 'src/common/response-class/all-null.response';
import { ListProductReviewResponse } from './response/list-product-review.response';
import { StudentProfileEntity } from '../student-profiles/entity/student-profile.entity';

@ApiTags('Product-Reviews')
@Controller('product-reviews')
export class ProductReviewsController {
  constructor(private readonly productReviewService: ProductReviewsService) {}

  @ApiOperation({ summary: 'Create new' })
  @Post('/create')
  @ApiBody({ type: CreateProductReviewDto })
  @ApiOkResponse({ type: CreateProductReviewResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async create(
    @Body() createProductReview: CreateProductReviewDto,
  ): Promise<any> {
    const profile = new StudentProfileEntity();
    const data = await this.productReviewService.create(
      createProductReview,
      profile,
    );
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiOkResponse({ type: ListProductReviewResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findAll(@Query() dto: PaginationDto) {
    const { total, data } = await this.productReviewService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiOkResponse({ type: CreateProductReviewResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findOne(@Param('id') id: string) {
    const data = await this.productReviewService.findOne(id);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Delete one' })
  @Delete(':id')
  @ApiOkResponse({ type: DeleteApiResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async remove(@Param('id') id: string) {
    await this.productReviewService.remove(id);
    return CoreApiResponse.success(null);
  }
}
