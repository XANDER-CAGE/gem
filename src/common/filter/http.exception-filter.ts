import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { CoreApiResponse } from '../util/core-api-response.util';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (exception instanceof HttpException) {
      const data = CoreApiResponse.error(exception.getResponse());
      response.status(exception.getStatus()).json(data);
    } else {
      console.log(exception);
      const error = new InternalServerErrorException();
      const data = CoreApiResponse.error(error.getResponse());
      response.status(500).json(data);
    }
  }
}
