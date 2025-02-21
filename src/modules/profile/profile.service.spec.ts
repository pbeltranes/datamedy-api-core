import { Test, TestingModule } from '@nestjs/testing';
import { Profile, STATUS_USER, User } from '@prisma/client';
import { beforeAll, expect, it, Mock, vi } from 'vitest';
import { CreateProfileDto } from './dto/create-profile.dto';
// import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';
import { PrismaService } from '@/providers/prisma/prisma.service';

let service: ProfileService;
let prismaServiceMock: {
  profile: {
    create: Mock<any, any>;
    update: Mock<any, any>;
    findUnique: Mock<any, any>;
    findMany: Mock<any, any>;
    delete: Mock<any, any>;
  };
};
beforeAll(async () => {
  prismaServiceMock = {
    profile: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      delete: vi.fn(),
    },
  };

  const moduleRef: TestingModule = await Test.createTestingModule({
    providers: [
      ProfileService,
      {
        provide: PrismaService,
        useValue: prismaServiceMock,
      },
    ],
  }).compile();

  service = moduleRef.get<ProfileService>(ProfileService);
});

it('should be defined', () => {
  expect(service).toBeDefined();
});

it('should create a profile', async () => {
  const user: User = {
    id: 'user123',
    email: 'test@example.com',
    firstName: '',
    lastName: '',
    phone: '',
    status: STATUS_USER.DRAFT,
    createdAt: undefined,
    membershipId: '',
    profileId: '',
    nationalId: '',
    nationality: '',
  };
  const createProfileDto: CreateProfileDto = {
    specialty: 'Cardiology',
    subspecialty: 'Interventional',
  };
  const createdProfile: Profile = {
    id: 'profile123',
    userId: user.id,
    specialty: createProfileDto.specialty,
    subspecialty: createProfileDto.subspecialty,
    createdAt: undefined,
    registrationNumber: '',
    profilePhotoUrl: '',
    idCardFrontUrl: '',
    idCardBackUrl: '',
    updatedAt: undefined,
  };

  prismaServiceMock.profile.create.mockResolvedValue(createdProfile);

  const result = await service.create(createProfileDto, user);
  expect(result).toEqual(createdProfile);
  expect(prismaServiceMock.profile.create).toHaveBeenCalledWith({
    data: {
      userId: user.id,
      specialty: createProfileDto.specialty,
      subspecialty: createProfileDto.subspecialty,
    },
  });
});

it('should return all profiles', async () => {
  const profiles: Profile[] = [
    {
      id: 'profile1',
      userId: 'user1',
      specialty: 'Cardiology',
      subspecialty: 'Interventional',
      createdAt: undefined,
      registrationNumber: '',
      profilePhotoUrl: '',
      idCardFrontUrl: '',
      idCardBackUrl: '',
      updatedAt: undefined,
    },
    {
      id: 'profile2',
      userId: 'user2',
      specialty: 'Neurology',
      subspecialty: 'Pediatric',
      createdAt: undefined,
      registrationNumber: '',
      profilePhotoUrl: '',
      idCardFrontUrl: '',
      idCardBackUrl: '',
      updatedAt: undefined,
    },
  ];
  prismaServiceMock.profile.findMany.mockResolvedValue(profiles);

  const result = await service.findAll();
  expect(result).toEqual(profiles);
  expect(prismaServiceMock.profile.findMany).toHaveBeenCalledWith({
    include: { user: false },
  });
});

// it('should update a profile', async () => {
//   const id = 'profile123';
//   const updateProfileDto: UpdateProfileDto = {
//     specialty: 'Updated Specialty',
//     subspecialty: 'Updated Subspecialty',
//   };
//   const updatedProfile: Profile = {
//     id,
//     userId: 'user123',
//     specialty: updateProfileDto.specialty,
//     subspecialty: updateProfileDto.subspecialty,
//     createdAt: undefined,
//     registrationNumber: '',
//     profilePhotoUrl: '',
//     idCardFrontUrl: '',
//     idCardBackUrl: '',
//     updatedAt: undefined,
//   };

//   prismaServiceMock.profile.update.mockResolvedValue(updatedProfile);

//   const result = await service.update(id, updateProfileDto);
//   expect(result).toEqual(updateProfileDto);
//   expect(prismaServiceMock.profile.update).toHaveBeenCalledWith({
//     where: { id },
//     data: updateProfileDto,
//   });
// });

// it('should delete a profile', async () => {
//   const id = 'profile123';
//   prismaServiceMock.profile.delete.mockResolvedValue({
//     id,
//     userId: 'user123',
//     specialty: 'Cardiology',
//     subspecialty: 'Interventional',
//   });

//   const result = await service.remove(id);
//   expect(result).toBe(`This action removes a #${id} profile`);
//   expect(prismaServiceMock.profile.delete).toHaveBeenCalledWith({
//     where: { id },
//   });
// });
