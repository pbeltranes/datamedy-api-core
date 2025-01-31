import { Module } from '@nestjs/common';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { MailerModule } from '@/providers/mailer/mailer.module';
import { PrismaModule } from '@/providers/prisma/prisma.module';

@Module({
  controllers: [LeadController],
  providers: [LeadService],
  imports: [PrismaModule, MailerModule],
})
export class LeadModule {}
