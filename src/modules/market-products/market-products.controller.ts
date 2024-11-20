import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './market-products.service';
import { CoreApiResponse } from 'src/common/response-class/core-api.response';
import { IdDto } from 'src/common/dto/id.dto';
import { CreateProductDto } from './dto/create-market-product.dto';
import { UpdateProductDto } from './dto/update-market-product.dto';
import { CreateMarketProductResponse } from './response/create-market-categories.response';
import { ErrorApiResponse } from 'src/common/response-class/error.response';
import { ListMarketProductResponse } from './response/list-market.response';
import { DeleteApiResponse } from 'src/common/response-class/all-null.response';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Public } from 'src/common/decorator/public.decorator';
import {
  FindAllCategoriesDto,
  FindAllProductsDto,
} from './dto/find-all.product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IMyReq } from 'src/common/interface/my-req.interface';

@ApiTags('Market-Products')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.app_admin)
@Controller('market-products')
export class MarketProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.app_admin)
  @ApiOperation({ summary: 'Create new one' })
  @Post('/create')
  @ApiBody({ type: CreateProductDto })
  @ApiOkResponse({ type: CreateMarketProductResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async create(@Body() dto: CreateProductDto) {
    const data = await this.productsService.create(dto);
    return CoreApiResponse.success(data);
  }

  @Roles(Role.app_admin, Role.student)
  @ApiOperation({ summary: 'Find all' })
  @Get('/list')
  @ApiOkResponse({ type: ListMarketProductResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findAll(@Query() dto: FindAllProductsDto) {
    const { total, data } = await this.productsService.findAll(dto);
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @Roles(Role.student, Role.app_admin)
  @ApiOperation({ summary: 'Find all' })
  @Get('/my')
  @ApiOkResponse({ type: ListMarketProductResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findMy(@Query() dto: PaginationDto, @Req() req: IMyReq) {
    const { total, data } = await this.productsService.findMy({
      ...dto,
      profile_id: req.profile.id,
    });
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @Public()
  @ApiOperation({ summary: 'Get one' })
  @Get('/get-one:id')
  @ApiOkResponse({ type: CreateMarketProductResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findOne(@Param() { id }: IdDto) {
    const data = await this.productsService.findOne(id);
    return CoreApiResponse.success(data);
  }

  @Roles(Role.app_admin)
  @ApiOperation({ summary: 'Update one' })
  @Patch(':id')
  @ApiBody({ type: UpdateProductDto })
  @ApiOkResponse({ type: CreateMarketProductResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async update(@Param() { id }: IdDto, @Body() dto: UpdateProductDto) {
    const data = await this.productsService.update(id, dto);
    return CoreApiResponse.success(data);
  }

  @Roles(Role.app_admin)
  @ApiOperation({ summary: 'Update with sorting' })
  @Patch('/update-sort/:id')
  @ApiBody({ type: UpdateProductDto })
  @ApiOkResponse({ type: CreateMarketProductResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async updateSorting(@Param() { id }: IdDto, @Body() dto: UpdateProductDto) {
    const data = await this.productsService.update(id, dto);
    return CoreApiResponse.success(data);
  }

  @Roles(Role.app_admin)
  @ApiOperation({ summary: 'Delete one' })
  @Delete(':id')
  @ApiOkResponse({ type: DeleteApiResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async remove(@Param() { id }: IdDto) {
    await this.productsService.remove(id);
    return CoreApiResponse.success(null);
  }

  @Roles(Role.student)
  @ApiOperation({ summary: 'Find all categories product' })
  @Get('/list_categories')
  @ApiOkResponse({ type: ListMarketProductResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async listWithCategories(
    @Query() dto: FindAllCategoriesDto,
    @Req() req: IMyReq,
  ) {
    const { total, data } = await this.productsService.listWithCategories(
      dto,
      req.profile.id,
    );
    const pagination = { total, limit: dto.limit, page: dto.page };
    return CoreApiResponse.success(data, pagination);
  }

  @Roles(Role.student)
  @ApiOperation({ summary: 'Find by one product from 4 categories' })
  @Get('/get-four-product')
  @ApiOkResponse({ type: ListMarketProductResponse, status: 200 })
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async listFourProducts(@Req() req: IMyReq) {
    const { data } = await this.productsService.listFourProducts(
      req.profile.id,
    );
    return CoreApiResponse.success(data);
  }
}
