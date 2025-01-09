import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const SignUp = extendApi(
  z
    .object({
      email: z.string().email(), // Ensures non-empty strings
      firstName: z.string().min(1, 'Name is required'),
      lastName: z.string().min(1, 'Requiere Apellido'),
      phone: z.string().min(1, 'Phone is required'),
      membershipId: z.string().optional(),
      rut: z.string().optional(),
    })
    .strict(),
  {
    title: 'Client',
    description: 'A Client',
  },
);

export class CreateUserDto extends createZodDto(SignUp) {}
