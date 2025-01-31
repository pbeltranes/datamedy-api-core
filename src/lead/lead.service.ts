import { Injectable } from '@nestjs/common';
import { Lead } from '@prisma/client';
import { CreateLeadContactDto, CreateLeadDto } from './dto/create-lead.dto';
import { PrismaService } from '@/providers/prisma/prisma.service';

@Injectable()
export class LeadService {
  constructor(readonly prismaService: PrismaService) {}
  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    const { email, contactType } = createLeadDto;

    const lead = await this.prismaService.lead.create({
      data: { email, contactType },
    });
    return lead;
  }

  async createContact(createLeadDto: CreateLeadContactDto): Promise<Lead> {
    const { email, name, contactType } = createLeadDto;

    const lead = await this.prismaService.lead.create({
      data: { email, name, contactType },
    });
    return lead;
  }

  findAll() {
    return this.prismaService.lead.findMany();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findOne(email: number) {
    // const lead = await this.prismaService.lead.findFirst({
    //   where: { email },
    // });
  }
  async findBy(field: string, value: string) {
    if (field === 'email' || field === 'phone') {
      return this.prismaService.lead.findFirst({
        where: { email: value },
      });
    }
  }

  update(email: string) {
    return this.prismaService.lead.update({
      where: { email },
      data: { isSuscribed: false },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} lead`;
  }
}
