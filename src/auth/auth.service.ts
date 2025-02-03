import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(configService: ConfigService) {
    this.supabase = createClient(
      configService.get<string>('SUPABASE_URL'),
      configService.get<string>('UPABASE_SERVICE_ROLE_KEY'),
    );
  }

  async validateUser(token: string): Promise<any> {
    const { data, error } = await this.supabase.auth.getUser(token);
    if (error || !data.user) {
      throw new UnauthorizedException('Invalid token');
    }
    return data.user;
  }
}
