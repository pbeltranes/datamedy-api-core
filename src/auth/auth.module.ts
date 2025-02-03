import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SupabaseAuthGuard } from './guards/supabase.auth.guard';
import { SupabaseStrategy } from './strategies/supabase.strategy';
@Module({
  imports: [PassportModule, ConfigModule],
  providers: [SupabaseAuthGuard, SupabaseStrategy, AuthService],
  exports: [SupabaseAuthGuard],
})
export class AuthModule {}
