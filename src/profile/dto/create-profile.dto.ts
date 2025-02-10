import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const CreateProfile = extendApi(
  z.object({
    email: z.string().email(),
    nationalId: z.string().regex(/^[0-9]{7,8}-[0-9kK]{1}$/, 'RUT inválido'),
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    nationality: z.string().min(2, 'País inválido'),
    specialty: z.string().min(2, 'Especialidad inválida'),
    subspecialty: z.string().min(2, 'Subespecialidad inválida'),
    phone: z
      .string()
      .regex(
        /^\+?56?\s?[2-9]\d{1}\s?\d{4}\s?\d{4}$/,
        'Número de teléfono inválido',
      ),
  }),
);
export class CreateProfileDto extends createZodDto(CreateProfile) {}
