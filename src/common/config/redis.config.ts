import {
  RedisModuleOptions,
  RedisOptionsFactory,
} from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { env } from './env.config';

@Injectable()
export class RedisConfig implements RedisOptionsFactory {
  createRedisOptions(): RedisModuleOptions {
    return {
      config: {
        url: `redis://:${env.REDIS_PASS}@${env.REDIS_HOST}:${env.REDIS_PORT}/0`,
      },
    };
  }
}
