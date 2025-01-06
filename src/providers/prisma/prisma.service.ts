import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly configService: ConfigService) {
    const isDevelopment =
      configService.get<string>('NODE_ENV') === 'development';

    super({
      log: isDevelopment ? ['info', 'warn', 'error'] : [],
    });
  }
}
