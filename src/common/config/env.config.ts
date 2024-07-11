import { config } from 'dotenv';
import { cleanEnv, num, str } from 'envalid';

config();

export const env = cleanEnv(process.env, {
  PORT: num({ default: 3000, example: '3000' }),
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  API_HOST: str({ default: 'localhost' }),
  PG_HOST: str(),
  PG_PORT: num({ default: 5432 }),
  PG_DB: str(),
  PG_USER: str(),
  PG_PASS: str(),
  REDIS_HOST: str(),
  REDIS_PORT: num({ default: 6379 }),
  REDIS_PASS: str(),
});
