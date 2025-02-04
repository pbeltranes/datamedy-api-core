import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { SupabaseAuthGuard } from './auth/guards/supabase.auth.guard';
@ApiTags('Application')
@Controller('config')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Public available' })
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/debug-sentry')
  getError() {
    throw new Error('My first Sentry error!');
  }
  @ApiBearerAuth()
  @Get('/protected')
  @ApiOperation({ summary: 'Protected Endpoint' })
  @UseGuards(SupabaseAuthGuard)
  async protected(@Req() req) {
    return {
      message: 'AuthGuard works 🎉',
      authenticated_user: req.user,
    };
  }
}
