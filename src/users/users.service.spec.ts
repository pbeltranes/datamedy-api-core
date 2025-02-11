import { STATUS_USER, User } from '@prisma/client';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsersService } from './users.service';
import { PrismaService } from '@/providers/prisma/prisma.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaServiceMock: PrismaService;

  beforeEach(() => {
    prismaServiceMock = {
      user: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
      },
    } as unknown as PrismaService;

    usersService = new UsersService(prismaServiceMock);
  });

  it('should create a new user', async () => {
    const createUserDto = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '123456789',
    };

    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '123456789',
      status: STATUS_USER.ACTIVE,
      createdAt: undefined,
      membershipId: '',
      nationalId: '',
      nationality: 'Chilena',
    };

    (prismaServiceMock.user.create as any).mockResolvedValue(mockUser);

    const result = await usersService.create(createUserDto);

    expect(prismaServiceMock.user.create).toHaveBeenCalledWith({
      data: createUserDto,
    });
    expect(result).toEqual(mockUser);
  });

  it('should retrieve all users', async () => {
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '123456789',
        status: STATUS_USER.ACTIVE,
        createdAt: undefined,
        membershipId: '',
        nationalId: '',
        nationality: 'Chilena',
      },
      {
        id: '2',
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '987654321',
        status: STATUS_USER.ACTIVE,
        createdAt: undefined,
        membershipId: '',
        nationalId: '',
        nationality: 'Chilena',
      },
    ];

    (prismaServiceMock.user.findMany as any).mockResolvedValue(mockUsers);

    const result = await usersService.findAll();

    expect(prismaServiceMock.user.findMany).toHaveBeenCalledWith({ take: 10 });
    expect(result).toEqual(mockUsers);
  });

  it('should retrieve a user by id', async () => {
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '123456789',
      status: STATUS_USER.ACTIVE,
      createdAt: undefined,
      membershipId: '',
      nationalId: '',
      nationality: 'Chilena',
    };

    (prismaServiceMock.user.findUnique as any).mockResolvedValue(mockUser);

    const result = await usersService.findOne('1');

    expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(result).toEqual(mockUser);
  });

  it('should update a user', async () => {
    const updateUserDto = {
      email: 'updated@example.com',
      firstName: 'Updated',
      lastName: 'User',
      phone: '123123123',
      nationalId: '',
      nationality: 'Chilena',
    };

    const mockUpdatedUser: User = {
      id: '1',
      email: 'updated@example.com',
      firstName: 'Updated',
      lastName: 'User',
      phone: '123123123',
      status: STATUS_USER.ACTIVE,
      createdAt: undefined,
      membershipId: '',
      nationalId: '',
      nationality: 'Chilena',
    };

    (prismaServiceMock.user.update as any).mockResolvedValue(mockUpdatedUser);

    const result = await usersService.update('1', updateUserDto);

    // expect(prismaServiceMock.user.update).toHaveBeenCalledWith({
    //   where: { id: '1' },
    //   data: updateUserDto,
    // });
    expect(result).toEqual(mockUpdatedUser);
  });

  it('should soft delete a user', async () => {
    const mockSoftDeletedUser: User = {
      id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '123456789',
      status: STATUS_USER.DESACTIVE,
      createdAt: undefined,
      membershipId: '',
      nationalId: '',
      nationality: 'Chilena',
    };

    (prismaServiceMock.user.update as any).mockResolvedValue(
      mockSoftDeletedUser,
    );

    const result = await usersService.softDelete('1');

    expect(prismaServiceMock.user.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { status: STATUS_USER.DESACTIVE },
    });
    expect(result).toEqual(mockSoftDeletedUser);
  });
});
