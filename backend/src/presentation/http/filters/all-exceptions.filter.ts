import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[] = 'Error interno del servidor';
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const msg = (exceptionResponse as Record<string, unknown>).message;
        message =
          typeof msg === 'string' || Array.isArray(msg)
            ? (msg as string | string[])
            : exception.message;
      } else {
        message = exception.message;
      }
    }

    const logPayload = {
      method: request.method,
      url: request.url,
      statusCode: status,
      message,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    };

    if (status >= 500) {
      this.logger.error(
        logPayload,
        exception instanceof Error ? exception.stack : String(exception),
      );

      if (Sentry.isInitialized()) {
        Sentry.withScope((scope) => {
          scope.setTag('status_code', String(status));
          scope.setContext('request', {
            method: request.method,
            url: request.url,
            headers: { 'user-agent': request.headers['user-agent'] },
            requestId: request.headers['x-request-id'],
            contentLength: request.headers['content-length'],
          });
          if (exception instanceof Error) {
            Sentry.captureException(exception);
          } else {
            Sentry.captureMessage(String(exception), 'error');
          }
        });
      }
    } else {
      this.logger.warn(logPayload);
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
