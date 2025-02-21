import { Injectable } from '@nestjs/common';
import { Practitioner, User } from '@prisma/client';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '@/providers/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createProfileDto: CreateProfileDto, user: User): Promise<Practitioner> {
    const { specialty, subspecialty } = createProfileDto;
    return this.prismaService.practitioner.create({
      data: {
        userId: user.id,
        specialty,
        subspecialty,
      },
    });
  }

  findAll(includeUser: boolean = false) {
    return this.prismaService.practitioner.findMany({
      include: {
        user: includeUser,
      },
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} profile`;
  }

  update(userId: string, updateProfileDto: UpdateProfileDto) {
    const { specialty, subspecialty } = updateProfileDto;
    return this.prismaService.practitioner.update({
      where: { userId },
      data: {
        specialty,
        subspecialty,
      },
    });
  }

  // remove(id: string) {
  //   return `This action removes a #${id} profile`;
  // }
}
