import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartRepo } from './repo/cart.repo';
import { HomeService } from '../home/home.service';
import { StudentProfilesService } from '../student-profiles/student-profiles.service';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepo: CartRepo,
    private readonly homeService: HomeService,
    private readonly studentProfileService: StudentProfilesService,
  ) {}

  async add(createCartDto: CreateCartDto, profile_id: string) {
    const existProfile = await this.studentProfileService.findOne(profile_id);

    if (!existProfile) {
      throw new NotFoundException('This student profile does not exist');
    }

    const existCart = await this.cartRepo.existProfile(
      createCartDto.product_id,
      profile_id,
    );

    if (!existCart) {
      return await this.cartRepo.create(createCartDto, profile_id);
    }

    return await this.cartRepo.add(createCartDto.product_id, profile_id);
  }

  async findAll(profile_id: string) {
    const existProfile = await this.studentProfileService.findOne(profile_id);

    if (!existProfile) {
      throw new NotFoundException('This student profile does not exist');
    }
    return await this.cartRepo.findAll(profile_id);
  }

  async reduce(product_id: string, profile_id: string) {
    const existProfile = await this.cartRepo.existProfile(
      product_id,
      profile_id,
    );

    if (!existProfile) {
      throw new NotFoundException(
        'This student profile does not exist in cart',
      );
    }

    return await this.cartRepo.reduce(product_id, profile_id);
  }

  async buy(profile_id: string) {
    const existProfile = await this.studentProfileService.findOne(profile_id);

    if (!existProfile) {
      throw new NotFoundException('This student profile does not exist');
    }

    const items = await this.cartRepo.list(profile_id);

    for (const item of items) {
      for (let i = 0; i < item.count; i++) {
        await this.homeService.buyProduct(
          { product_id: item.product_id },
          existProfile,
        );
      }

      await this.cartRepo.remove(item.id);
    }
  }
}
