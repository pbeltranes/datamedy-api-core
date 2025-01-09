// src/openai/openai.module.ts
import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

@Global()
@Module({
  providers: [
    {
      provide: 'OPENAI_API',
      useFactory: (configService: ConfigService) => {
        return new OpenAI({
          apiKey: configService.get<string>('OPENAPI_KEY'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['OPENAI_API'],
})
export class OpenaiModule {}
