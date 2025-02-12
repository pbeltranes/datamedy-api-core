import { ZodValidationPipe } from '@anatine/zod-nestjs';
import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  // Delete,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { STATUS_USER, User } from '@prisma/client';
import { CreateProfileDto } from './dto/create-profile.dto';
// import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';
import { SupabaseAuthGuard } from '@/auth/guards/supabase.auth.guard';
import { UserMetadata } from '@/auth/user.decorator';
import { UsersService } from '@/users/users.service';

@ApiBearerAuth()
@ApiTags('Profile')
@ApiTags('internal') // 👈 Categoriza los endpoints como "public" o "internal"
@Controller('profile')
@UsePipes(ZodValidationPipe)
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create or update a profile' })
  @UseGuards(SupabaseAuthGuard)
  @ApiResponse({ status: 201, description: 'Profile processed successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async create(
    @UserMetadata('email') email: string,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    const user = await this.userService.findByEmail(email, true);

    if (user) {
      await this.updateProfile(user, createProfileDto);
    } else {
      await this.createProfile(email, createProfileDto);
    }

    if (createProfileDto.status === STATUS_USER.PENDING) {
      await this.sendInternalNotification();
    }
    return true;
  }

  private async updateProfile(user: User, createProfileDto: CreateProfileDto) {
    await this.userService.update(user.id, createProfileDto);
    return this.profileService.update(user.profileId, createProfileDto);
  }

  private async createProfile(
    email: string,
    createProfileDto: CreateProfileDto,
  ) {
    const newUser = await this.userService.create({
      email,
      ...createProfileDto,
    });
    await this.profileService.create(createProfileDto, newUser);
  }

  private async sendInternalNotification() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }

  @Get('email')
  @UseGuards(SupabaseAuthGuard)
  findOneByEmail(@UserMetadata('email') email: string) {
    return this.userService.findByEmail(email, true);
  }
  @Get('')
  @ApiOperation({ summary: 'Retrieve all users' })
  @UseGuards(SupabaseAuthGuard)
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  @UseGuards(SupabaseAuthGuard)
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  // @Patch(':id')
  // @UseGuards(SupabaseAuthGuard)
  // update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
  //   return this.profileService.update(id, updateProfileDto);
  // }

  // @Delete(':id')
  // @UseGuards(SupabaseAuthGuard)
  // remove(@Param('id') id: string) {
  //   return this.profileService.remove(id);
  // }
}
