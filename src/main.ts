import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import { Logger } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { Logger as PinoLogger } from 'nestjs-pino';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './prisma-exceptions.filter';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const logger = new Logger('Bootstrap');

  // Reemplazar el Logger por Pino (opcional)
  app.useLogger(app.get(PinoLogger));
  const corsOptions: CorsOptions = {
    origin: configService.get('ORIGIN_HOST'), // Origen permitido
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Habilitar el envío de cookies
  };
  app.enableCors(corsOptions);

  const config = new DocumentBuilder()
    .setTitle('Medical API')
    .setDescription('Datamedy API')
    .setVersion('1.0')
    .build();
  patchNestjsSwagger(); // <--- This is the hacky patch using prototypes (for now)

  // Agregar filtro global
  app.useGlobalFilters(new PrismaExceptionFilter(), new AllExceptionsFilter());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // const port = 8080;

  /// EXPERIMENTAL STUFF
  // fix this because I had to define NODE_ENV on package.json to make it work

  await app.listen(configService.get('PORT'));
  logger.log(`\n\n\n   🚀 Swagger's running on ${await app.getUrl()}/api\n\n`);
}
bootstrap();
