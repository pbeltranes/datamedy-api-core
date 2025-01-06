import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;
  const configServiceMock = {
    get: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });
});
