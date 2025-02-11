import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserMetadata = createParamDecorator(
  (key: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return key ? user?.[key] : user; // Retorna todo el usuario o solo la clave especificada
  },
);
