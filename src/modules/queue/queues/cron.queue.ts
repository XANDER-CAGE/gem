import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { CRON_QUEUE_NAME } from '../constant/cron-queue-name';
import { Queue } from 'bull';
import { CronProcessNames } from '../enum/process-name.enum';

@Injectable()
export class CronQueueService implements OnModuleInit {
  constructor(@InjectQueue(CRON_QUEUE_NAME) private cronQueue: Queue) {}

  async onModuleInit() {
    await this.cronQueue.obliterate();
    await this.cronQueue.add(
      CronProcessNames.ATTENDANCE,
      {},
      {
        repeat: { cron: '0 0 14 * * *' },
      },
    );
    await this.cronQueue.add(
      CronProcessNames.GET_GRADES,
      {},
      {
        repeat: { cron: '0 0 15 * * *' },
      },
    );
    await this.cronQueue.add(
      CronProcessNames.SAVE_LEADERSHIP,
      {},
      {
        repeat: { cron: '0 0 14 * * *' },
      },
    );
  }
}
