import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductReviewsService } from './product-reviews.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { CreateProductReviewResponse } from './response/create-product-review.response';
import { ErrorApiResponse } from 'src/common/response-class/error.response';
import { DeleteApiResponse } from 'src/common/response-class/all-null.response';
import { ListProductReviewResponse } from './response/list-product-review.response';
import { FindAllProductReviewDto } from './dto/find-all.product-review.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/common/decorator/roles.decorator';
import { IMyReq } from 'src/common/interface/my-req.interface';

@ApiTags('Product-Reviews')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('product-reviews')
export class ProductReviewsController {
  constructor(private readonly productReviewService: ProductReviewsService) {}

  @Roles(Role.student)
  @ApiOperation({ summary: 'Create new' })
  @Post('/create')
  @ApiBody({ type: CreateProductReviewDto })
  @ApiOkResponse({ type: CreateProductReviewResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async create(
    @Body() createProductReview: CreateProductReviewDto,
    @Req() req: IMyReq,
  ): Promise<any> {
    const data = await this.productReviewService.create(
      createProductReview,
      req.user.profile,
    );
    return CoreApiResponse.success(data);
  }

  @Roles(Role.app_admin, Role.student)
  @Public()
  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiOkResponse({ type: ListProductReviewResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findAll(@Query() dto: FindAllProductReviewDto) {
    const { total, data } = await this.productReviewService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @Roles(Role.app_admin, Role.student)
  @Public()
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
