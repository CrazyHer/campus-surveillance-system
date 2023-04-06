import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class ExceptionTransformerFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    Logger.error(exception);
    console.error(exception);
    const exceptionMessage =
      exception instanceof HttpException
        ? exception.message
        : String(exception);

    const responseBody = {
      success: false,
      message: exceptionMessage,
      data: {},
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
