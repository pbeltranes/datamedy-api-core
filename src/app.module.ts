import { Module } from '@nestjs/common';
import { ConfigModule /*, ConfigService*/ } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';

import * as Joi from 'joi';
// import { LoggerModule } from 'nestjs-pino';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { LeadModule } from './modules/lead/lead.module';
import { ProfileModule } from './modules/profile/profile.module';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
      }),
      isGlobal: true, // Makes ConfigModule available globally
    }),
    AuthModule,
    UsersModule,
    LeadModule,
    ProfileModule,
    // LoggerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: () => ({
    //     pinoHttp: {
    //       level: 'info',
    //       transport: {
    //         target: 'pino-pretty',
    //         options: {
    //           colorize: true,
    //           translateTime: 'HH:MM:ss Z',
    //           ignore: 'pid,hostname',
    //         },
    //       },
    //     },
    //   }),
    // }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule { }
