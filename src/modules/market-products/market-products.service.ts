import { Injectable } from '@nestjs/common';
import { CreateMarketProductDto, UpdateMarketProductDto } from './dto/market-products.dto';


@Injectable()
export class MarketProductsService {
  create(createMarketProductDto: CreateMarketProductDto) {
    return 'This action adds a new marketProduct';
  }

  findAll() {
    return `This action returns all marketProducts`;
  }

  findOne(id: string) {
    return `This action returns a #${id} marketProduct`;
  }

  update(id: string, updateMarketProductDto: UpdateMarketProductDto) {
    return `This action updates a #${id} marketProduct`;
  }

  remove(id: string) {
    return `This action removes a #${id} marketProduct`;
  }
}
