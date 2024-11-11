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
  MINIO_ACCESS_KEY: str(),
  MINIO_ENDPOINT: str(),
  MINIO_PORT: num(),
  MINIO_SECRET_KEY: str(),
  MINIO_BUCKET: str(),
  REDIS_HOST: str(),
  REDIS_PORT: num(),
  REDIS_PASS: str(),
});
