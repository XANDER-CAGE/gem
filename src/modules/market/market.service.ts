import { Injectable } from '@nestjs/common';
import { CreateMarketDto, UpdateMarketDto } from './dto/market.dto';


@Injectable()
export class MarketService {
  create(createMarketDto: CreateMarketDto) {
    return 'This action adds a new market';
  }

  findAll() {
    return `This action returns all market`;
  }

  findOne(id: string) {
    return `This action returns a #${id} market`;
  }

  update(id: string, updateMarketDto: UpdateMarketDto) {
    return `This action updates a #${id} market`;
  }

  remove(id: string) {
    return `This action removes a #${id} market`;
  }
}
