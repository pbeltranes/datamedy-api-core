import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty({ description: 'Assistant from ChatGpt' })
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  createdAt: Date;
  membershipId: number | null;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  // Puedes añadir métodos para formatear datos si es necesario
  getFormattedName(): string {
    return `${this.name} (Age: ${this.username})`;
  }
}
