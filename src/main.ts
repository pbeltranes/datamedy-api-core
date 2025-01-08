import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

export async function bootstrap() {
  const adapter = new FastifyAdapter({ logger: false });
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  const configService = app.get(ConfigService);
  [].forEach((envVar) => {
    if (!configService.get(envVar)) {
      console.error(`Missing required environment variable: ${envVar}`);
      process.exit(1);
    }
  });
  const corsOptions: CorsOptions = {
    origin: configService.get('ORIGIN_HOST'), // Origen permitido
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Habilitar el envío de cookies
  };
  app.enableCors(corsOptions);

  const config = new DocumentBuilder()
    .setTitle('Medical API')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();
  patchNestjsSwagger(); // <--- This is the hacky patch using prototypes (for now)

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // const port = 8080;

  /// EXPERIMENTAL STUFF
  // fix this because I had to define NODE_ENV on package.json to make it work

  await app.listen(8080, '0.0.0.0');
  console.info(
    `\n\n\n   🚀 Swagger's running on ${await app.getUrl()}/api\n\n`,
  );
}
bootstrap();
