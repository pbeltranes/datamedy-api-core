import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const UserZ = extendApi(
  z.object({
    email: z.string(),
    name: z.string(),
    phone: z.string(),
    username: z.string(),
    picture: z.string(),
  }),
  {
    title: 'Client',
    description: 'A Client',
  },
);
export class CreateUserDto extends createZodDto(UserZ) {}
