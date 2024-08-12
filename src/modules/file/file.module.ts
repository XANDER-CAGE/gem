import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MinioModule } from 'nestjs-minio-client';
import { env } from 'src/common/config/env.config';
import { FileRepo } from './repo/file.repo';

@Module({
  imports: [
    MinioModule.register({
      endPoint: env.MINIO_ENDPOINT,
      port: env.MINIO_PORT,
      useSSL: false,
      accessKey: env.MINIO_ACCESS_KEY,
      secretKey: env.MINIO_SECRET_KEY,
    }),
  ],
  controllers: [FileController],
  providers: [FileService, FileRepo],
})
export class FileModule {}
