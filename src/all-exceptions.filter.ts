import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FastifyReply } from 'fastify';
import { PrismaExceptionFilter } from './prisma-exceptions.filter';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>(); // Obtén la respuesta de Fastify
    const request = ctx.getRequest();

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Delegar el manejo a PrismaExceptionFilter
      const prismaFilter = new PrismaExceptionFilter();
      prismaFilter.catch(exception, host);
      return;
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';
    console.log(exception instanceof Prisma.PrismaClientKnownRequestError);
    response
      .status(status) // Configura el código de estado HTTP
      .send({
        // Usa `send` en lugar de `json`
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message:
          typeof message === 'string' ? message : (message as any).message,
      });
  }
}
