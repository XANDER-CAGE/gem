import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductReviewsService } from './product-reviews.service';
import {
  CreateProductReviewDto,
  UpdateProductReviewDto,
} from './dto/product-reviews.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('Product-Reviews')
@Controller('product-reviews')
export class ProductReviewsController {
  constructor(private readonly productReviewService: ProductReviewsService) {}

  @ApiOperation({ summary: 'Create new' })
  @Post('/create')
  @ApiBody({ type: CreateProductReviewDto })
  @ApiOkResponse({ type: CoreApiResponse })
  async create(
    @Body() createProductReview: CreateProductReviewDto,
  ): Promise<any> {
    const data = await this.productReviewService.create(createProductReview);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiOkResponse({ type: CoreApiResponse })
  async findAll(@Query() dto: PaginationDto) {
    const { total, data } = await this.productReviewService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @ApiOperation({ summary: 'Get one' })
  @Get(':id')
  @ApiOkResponse({ type: CoreApiResponse })
  async findOne(@Param('id') id: string) {
    const data = await this.productReviewService.findOne(id);
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Update one' })
  @Patch(':id')
  @ApiBody({ type: UpdateProductReviewDto })
  @ApiOkResponse({ type: CoreApiResponse })
  async update(
    @Param('id') id: string,
    @Body() updateProductReview: UpdateProductReviewDto,
  ) {
    const data = await this.productReviewService.update(
      id,
      updateProductReview,
    );
    return CoreApiResponse.success(data);
  }

  @ApiOperation({ summary: 'Delete one' })
  @Delete(':id')
  @ApiOkResponse({ type: CoreApiResponse })
  async remove(@Param('id') id: string) {
    await this.productReviewService.remove(id);
    return CoreApiResponse.success(null);
  }
}
