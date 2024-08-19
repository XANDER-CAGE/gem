import { KnexModuleOptions, KnexOptionsFactory } from 'nest-knexjs';
import { Injectable } from '@nestjs/common';
import { env } from './env.config';

@Injectable()
export class KnexConfigService implements KnexOptionsFactory {
  createKnexOptions(): KnexModuleOptions {
    return {
      name: 'GEM-API',
      config: {
        client: 'postgresql',
        connection: {
          host: env.PG_HOST,
          user: env.PG_USER,
          port: env.PG_PORT,
          password: env.PG_PASS,
          database: env.PG_DB,
          timezone: 'utc',
        },
        pool: {
          min: 75,
          max: 100,
        },
      },
      retryAttempts: 3,
      retryDelay: 5,
    };
  }
}
