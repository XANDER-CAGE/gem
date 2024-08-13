import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Query,
  Res,
  Req,
} from '@nestjs/common';
import { FileService } from './file.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/common/interface/buffered-file.interface';
import { GetFileDto } from './dto/get-file.dto';
import { Response } from 'express';
import { IMyReq } from 'src/common/interface/my-req.interface';

@ApiBearerAuth()
@ApiTags('Files')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: BufferedFile, @Req() req: IMyReq) {
    return this.fileService.upload(file, req.user.id);
  }

  @Get()
  getFile(@Query() dto: GetFileDto, @Res() res: Response) {
    return this.fileService.getFile(dto.fileId, res);
  }
}
