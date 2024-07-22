import { Inject, Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ChannelCategoriesRepo } from './repo/channel-categories.repo';
import { CreateChannelCategoriesDto } from './dto/channel-categories-create.dto';
import { UpdateChannelCategoriesDto } from './dto/channel-categories-update.dto';
import { IFindAllChannelCategories } from './interface/channel-categories.interface';

@Injectable()
export class ChannelCategoriesService {
  constructor(
    @Inject() private readonly channelCategoriesRepo: ChannelCategoriesRepo,
  ) {}
  async create(createChannelCategoriesDto: CreateChannelCategoriesDto) {
    return this.channelCategoriesRepo.create(createChannelCategoriesDto);
  }

  async findAll(
    findAllChannelCategoriesDto: PaginationDto,
  ): Promise<IFindAllChannelCategories> {
    return this.channelCategoriesRepo.findAll(findAllChannelCategoriesDto);
  }

  async findOne(id: string) {
    return await this.channelCategoriesRepo.findOne(id);
  }

  async update(
    id: string,
    updateChannelCategoriesDto: UpdateChannelCategoriesDto,
  ) {
    return this.channelCategoriesRepo.update(id, updateChannelCategoriesDto);
  }

  async remove(id: string) {
    await this.channelCategoriesRepo.delete(id);
  }
}
