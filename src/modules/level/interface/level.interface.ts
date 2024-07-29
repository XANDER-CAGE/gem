import { ProductEntity } from 'src/modules/market-products/entity/product.interface';
import { LevelEntity } from '../entity/level.entity';
import { BadgeEntity } from 'src/modules/badge/entity/badge.entity';

export class IFindAllLevel {
  total: number;
  data: LevelEntity[];
}

export class UnreachedLevelsRes extends LevelEntity {
  products: ProductEntity[];
  badge: BadgeEntity;
}
