import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { CRON_QUEUE_NAME } from './constant/cron-queue-name';
import { env } from 'src/common/config/env.config';
import { CronQueueService } from './queues/cron.queue';
import { CronProcessor } from './processors/cron-queue.processor';
import { HomeModule } from '../home/home.module';
import { AttendanceModule } from '../attendance/attendance.module';
import { LeadershipModule } from '../leadership/leadership.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: CRON_QUEUE_NAME,
      redis: {
        host: env.REDIS_HOST,
        password: env.REDIS_PASS,
        port: env.REDIS_PORT,
      },
    }),
    HomeModule,
    AttendanceModule,
    LeadershipModule,
  ],
  providers: [CronQueueService, CronProcessor],
})
export class QueueModule {}
