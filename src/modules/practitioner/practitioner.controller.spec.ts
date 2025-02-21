import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProfileController } from './practitioner.controller';
import { ProfileService } from './practitioner.service';
import { PrismaModule } from '@/providers/prisma/prisma.module';
import { UsersModule } from '@/users/users.module';

describe('ProfileController', () => {
  let controller: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [ProfileService],
      imports: [PrismaModule, UsersModule],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
