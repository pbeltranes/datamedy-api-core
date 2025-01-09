import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
// import { fieldEncryptionExtension } from 'prisma-field-encryption';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly configService: ConfigService) {
    const isDevelopment =
      configService.get<string>('NODE_ENV') === 'development';
    // const encryptionMiddleware = fieldEncryptionExtension({
    //   encryptionKey: 'your-secret-key', // Usa una clave fuerte
    // });

    super({
      log: isDevelopment ? ['info', 'warn', 'error'] : [],
    });
    // this.$extends(encryptionMiddleware);
  }
}
