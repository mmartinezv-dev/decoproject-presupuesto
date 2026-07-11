import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const requestId = randomUUID();
    const controller = context.getClass().name;
    const handler = context.getHandler().name;
    const start = Date.now();

    request.headers['x-request-id'] = requestId;

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        const response = context.switchToHttp().getResponse<Response>();
        this.logger.log({
          requestId,
          method,
          url,
          statusCode: response.statusCode,
          duration: `${duration}ms`,
          controller,
          handler,
          userAgent: request.headers['user-agent'],
          ip: request.ip,
        });
      }),
    );
  }
}
