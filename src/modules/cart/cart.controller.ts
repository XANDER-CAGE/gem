import { Controller, Get, Post, Body, Patch, Param, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IMyReq } from 'src/common/interface/my-req.interface';
import { ErrorApiResponse } from 'src/common/response-class/error.response';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Add product to cart' })
  @Post('/add')
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async create(@Body() createCartDto: CreateCartDto, @Req() req: IMyReq) {
    return await this.cartService.add(createCartDto, req.profile.id);
  }

  @ApiOperation({ summary: 'Cart list of products' })
  @Get('/list')
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async findAll(@Req() req: IMyReq) {
    return await this.cartService.findAll(req.profile.id);
  }

  @ApiOperation({ summary: 'Reduce number of products' })
  @Patch('/reduce/:product_id')
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async update(@Param('product_id') product_id: string, @Req() req: IMyReq) {
    return await this.cartService.reduce(product_id, req.profile.id);
  }

  @ApiOperation({ summary: 'Buy selected products' })
  @Post('/buy')
  @ApiOkResponse({ type: ErrorApiResponse, status: 500 })
  async buy(@Req() req: IMyReq) {
    return await this.cartService.buy(req.profile.id);
  }
}
