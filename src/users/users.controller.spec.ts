import { NotFoundException } from '@nestjs/common';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersServiceMock: Partial<UsersService>;

  beforeEach(() => {
    usersServiceMock = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      softDelete: vi.fn(),
    };

    usersController = new UsersController(usersServiceMock as UsersService);
  });

  it('should create a new user', async () => {
    const createUserDto = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '123456789',
    };

    const mockUser = {
      id: '1',
      ...createUserDto,
    };

    (usersServiceMock.create as any).mockResolvedValue(mockUser);

    const result = await usersController.create(createUserDto);

    expect(usersServiceMock.create).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual(mockUser);
  });

  it('should retrieve all users', async () => {
    const mockUsers = [
      {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '123456789',
      },
      {
        id: '2',
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '987654321',
      },
    ];

    (usersServiceMock.findAll as any).mockResolvedValue(mockUsers);

    const result = await usersController.findAll();

    expect(usersServiceMock.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockUsers);
  });

  it('should retrieve a user by ID', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '123456789',
    };

    (usersServiceMock.findOne as any).mockResolvedValue(mockUser);

    const result = await usersController.findOne('1');

    expect(usersServiceMock.findOne).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException if user not found by ID', async () => {
    (usersServiceMock.findOne as any).mockResolvedValue(null);

    await expect(usersController.findOne('1')).rejects.toThrowError(
      NotFoundException,
    );

    expect(usersServiceMock.findOne).toHaveBeenCalledWith('1');
  });

  it('should update a user by ID', async () => {
    const updateUserDto = {
      email: 'updated@example.com',
      firstName: 'Updated',
      lastName: 'User',
      phone: '123123123',
    };

    const mockUser = { id: '1', ...updateUserDto };

    (usersServiceMock.findOne as any).mockResolvedValue(mockUser);
    (usersServiceMock.update as any).mockResolvedValue(mockUser);

    const result = await usersController.update('1', updateUserDto);

    expect(usersServiceMock.findOne).toHaveBeenCalledWith('1');
    expect(usersServiceMock.update).toHaveBeenCalledWith('1', updateUserDto);
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException if user not found when updating', async () => {
    const updateUserDto = {
      email: 'updated@example.com',
      firstName: 'Updated',
      lastName: 'User',
      phone: '123123123',
    };

    (usersServiceMock.findOne as any).mockResolvedValue(null);

    await expect(
      usersController.update('1', updateUserDto),
    ).rejects.toThrowError(NotFoundException);

    expect(usersServiceMock.findOne).toHaveBeenCalledWith('1');
    expect(usersServiceMock.update).not.toHaveBeenCalled();
  });

  it('should soft delete a user by ID', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '123456789',
    };

    (usersServiceMock.findOne as any).mockResolvedValue(mockUser);
    (usersServiceMock.softDelete as any).mockResolvedValue(mockUser);

    const result = await usersController.remove('1');

    expect(usersServiceMock.findOne).toHaveBeenCalledWith('1');
    expect(usersServiceMock.softDelete).toHaveBeenCalledWith('1');
    expect(result).toEqual({ message: 'User deleted successfully.' });
  });

  it('should throw NotFoundException if user not found when deleting', async () => {
    (usersServiceMock.findOne as any).mockResolvedValue(null);

    await expect(usersController.remove('1')).rejects.toThrowError(
      NotFoundException,
    );

    expect(usersServiceMock.findOne).toHaveBeenCalledWith('1');
    expect(usersServiceMock.softDelete).not.toHaveBeenCalled();
  });
});
