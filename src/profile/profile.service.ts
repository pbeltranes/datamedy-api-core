import { Injectable } from '@nestjs/common';
import { Profile, User } from '@prisma/client';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '@/providers/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createProfileDto: CreateProfileDto, user: User): Promise<Profile> {
    const { specialty, subspecialty } = createProfileDto;
    return this.prismaService.profile.create({
      data: {
        userId: user.id,
        specialty,
        subspecialty,
      },
    });
  }

  findAll(includeUser: boolean = false) {
    return this.prismaService.profile.findMany({
      include: {
        user: includeUser,
      },
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} profile`;
  }

  update(id: string, updateProfileDto: UpdateProfileDto) {
    const { specialty, subspecialty } = updateProfileDto;
    return this.prismaService.profile.update({
      where: { id },
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
