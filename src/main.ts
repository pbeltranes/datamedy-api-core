import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import { Logger } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import '@/lib/intrument';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './prisma-exceptions.filter';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const logger = new Logger('Bootstrap');

  // Reemplazar el Logger por Pino (opcional)
  const corsOptions: CorsOptions = {
    origin: configService.get('ORIGIN_HOST'), // Origen permitido
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Habilitar el envío de cookies
  };
  app.enableCors(corsOptions);

  // Filtra endpoints si no estás en desarrollo
  const isDev = configService.get('NODE_ENV') === 'development';
  if (isDev) {
    const config = new DocumentBuilder()
      .setTitle('Datamedy API')
      .setDescription('API para la plataforma Datamedy')
      .setVersion('1.0')
      .addBearerAuth() // ✅ Agrega autenticación
      .build();
    patchNestjsSwagger(); // <--- This is the hacky patch using prototypes (for now)
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  // Agregar filtro global
  app.useGlobalFilters(new PrismaExceptionFilter(), new AllExceptionsFilter());

  await app.listen(configService.get('PORT'));
  logger.log(`\n\n\n   🚀 Swagger's running on ${await app.getUrl()}/api\n\n`);
}
bootstrap();
