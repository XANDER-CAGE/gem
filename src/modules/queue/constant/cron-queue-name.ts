import { env } from 'src/common/config/env.config';

export const CRON_QUEUE_NAME = 'GEM_CRON_QUEUE_' + env.NODE_ENV;
