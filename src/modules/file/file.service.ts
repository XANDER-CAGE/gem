import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { MinioService } from 'nestjs-minio-client';
import { extname } from 'path';
import { BufferedFile } from 'src/common/interface/buffered-file.interface';
import { FileRepo } from './repo/file.repo';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { getBucketName } from 'src/common/utils/get-gucket-name.util';

@Injectable()
export class FileService {
  constructor(
    private readonly minio: MinioService,
    private readonly filesRepo: FileRepo,
    @InjectConnection() private readonly knex: Knex,
  ) {}

  async upload(file: BufferedFile, userId: string, knex = this.knex) {
    const mimeType = file.mimetype;
    const fileName: string = file.originalname;
    const fileBuffer = file.buffer;
    const created_by = userId;

    if (fileBuffer?.length / 1_000_000 > 20) {
      throw new ForbiddenException('More than 20 mb file upload is forbidden.');
    }

    return knex.transaction(async (trx) => {
      const saveFile = await this.filesRepo.saveFile(
        {
          bucket_name: getBucketName(),
          created_by,
          type: mimeType,
          name: fileName,
          size: fileBuffer.length,
        },
        trx,
      );

      await this.minio.client.putObject(
        getBucketName(),
        `${saveFile.id}${extname(fileName)}`,
        file.buffer,
      );
      delete saveFile.created_by;
      delete saveFile.is_deleted;
      return {
        ...saveFile,
      };
    });
  }

  async getFile(fileId: string, response: Response) {
    const file = await this.filesRepo.getById(fileId);
    if (!file) throw new NotFoundException('File not found');
    const stream = await this.minio.client.getObject(
      file.bucket_name,
      `${file.id}${extname(file.name)}`,
    );
    response.set({
      'Content-Disposition': `attachment; filename="${file.name}"`,
    });
    response.status(200);
    stream.pipe(response);
  }
}
