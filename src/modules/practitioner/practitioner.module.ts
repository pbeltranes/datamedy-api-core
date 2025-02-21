import { Module } from '@nestjs/common';
import { PractitionerController } from './practitioner.controller';
import { PractitionerService } from './practitioner.service';
import { PrismaModule } from '@/providers/prisma/prisma.module';
import { UsersModule } from '@/users/users.module';

@Module({
  controllers: [PractitionerController],
  providers: [PractitionerService],
  imports: [PrismaModule, UsersModule],
})
export class PractitionerModule {}
