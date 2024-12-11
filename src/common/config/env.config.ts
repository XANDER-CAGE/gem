import { config } from 'dotenv';
import { cleanEnv, num, str } from 'envalid';

config();

export const env = cleanEnv(process.env, {
  PORT: num({ default: 3000, example: '3000' }),
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  API_HOST: str({ default: 'localhost' }),
  PG_HOST: str({default: '10.7.9.28'}),
  PG_PORT: num({ default: 5432 }),
  PG_DB: str({default: 'admission'}),
  PG_USER: str({default: 'ak_admission_user'}),
  PG_PASS: str({default: 'gAjls4d4HcKuxS7JqhPnC2ij5bCFEJi6wxbNNHfd0nYyt1Ux4tjfOUwILc'}),
  MINIO_ACCESS_KEY: str({default: 'eTWAHi383mPMKijP'}),
  MINIO_ENDPOINT: str({default: '10.7.9.28'}),
  MINIO_PORT: num({default: 9000}),
  MINIO_SECRET_KEY: str({default: 'NyBSfizDX8ORZK6oNhpBSiB8lmFYP96S'}),
  MINIO_BUCKET: str({default: 'admission'}),
});
