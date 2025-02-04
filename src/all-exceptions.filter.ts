import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { WithSentry } from '@sentry/nestjs';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  @WithSentry()
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseMessage = exception.getResponse();
      message =
        typeof responseMessage === 'string'
          ? responseMessage
          : JSON.stringify(responseMessage);
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Manejamos errores de Prisma
      status = HttpStatus.BAD_REQUEST;
      message = `Database error: ${exception.message}`;
    }

    // 🚀 Mejor log para debugging
    Logger.error(
      `❌ Error ${status} - ${request.method} ${request.url}: ${
        typeof message === 'string' ? message : JSON.stringify(message)
      }`,
      exception instanceof Error ? exception.stack : '',
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof message === 'string' ? message : (message as any).message,
    });
  }
}
