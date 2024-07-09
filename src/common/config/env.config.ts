interface IEnv {
  PORT: number;
  PG_HOST: string;
  PG_PORT: number;
  PG_DB: string;
  PG_USER: string;
  PG_PASS: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_PASS: string;
}

export const env: IEnv = {
  PORT: +process.env.PORT || 3000,
  PG_HOST: process.env.PG_HOST || '',
  PG_PORT: +process.env.PG_PORT || 5432,
  PG_DB: process.env.PG_DB || '',
  PG_USER: process.env.PG_USER || '',
  PG_PASS: process.env.PG_PASS || '',
  REDIS_HOST: process.env.REDIS_HOST || '',
  REDIS_PORT: process.env.REDIS_PORT || '',
  REDIS_PASS: process.env.REDIS_PASS || '',
};
