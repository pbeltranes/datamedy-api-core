import { Injectable } from '@nestjs/common';
// import { CreateUserDto } from '@users/dto/create-user.dto';
import { User, STATUS_USER } from '@prisma/client';
import { UpdateUserDto } from '@users/dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '@/providers/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, firstName, lastName, phone } = createUserDto;
    console.log(email, firstName, lastName, phone);
    const user = await this.prismaService.user.create({
      data: { email, firstName, lastName, phone },
    });
    return user;
  }

  findAll() {
    return this.prismaService.user.findMany({ take: 10 });
  }

  findOne(id: string) {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const {
      email,
      firstName,
      lastName,
      phone,
      nationalId,
      nationality,
      status,
    } = updateUserDto;

    return this.prismaService.user.update({
      where: { id },
      data: {
        email,
        firstName,
        lastName,
        phone,
        nationalId,
        nationality,
        status,
      },
    });
  }

  softDelete(id: string) {
    return this.prismaService.user.update({
      where: { id },
      data: {
        status: STATUS_USER.DESACTIVE,
      },
    });
  }

  findByEmail(email: string, includeProfile: boolean = false) {
    return this.prismaService.user.findUnique({
      where: { email },
      include: { profile: includeProfile },
    });
  }
}
