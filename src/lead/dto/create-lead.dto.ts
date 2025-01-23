import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const createLead = extendApi(
  z
    .object({
      email: z.string().email(),
      name: z.string().optional(),
      phone: z.string().optional(),
      message: z.string().optional(),
      contactType: z.enum(['NEWSLETTER', 'CONTACT', 'LAUNCH']),
    })
    .strict(),
  {
    title: 'Lead',
    description: 'A Client',
  },
);

export class CreateLeadDto extends createZodDto(createLead) {}
