import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { UpdateUserDto } from '@users/dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { PrismaService } from '@/providers/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    // user.getFormattedName;
    const userD = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        name: createUserDto.name || 'defaultName',
        username: createUserDto.username || 'defaultUsername',
        email: createUserDto.email || 'defaultEmail@example.com',
        phone: createUserDto.phone || 'defaultPhone',
      },
    });
    // const user = new UserEntity(createUserDto);

    return;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action returns a #${(JSON.stringify(updateUserDto), id)} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
