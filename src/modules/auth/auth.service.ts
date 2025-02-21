import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    this.supabase = createClient(
      configService.get<string>('SUPABASE_URL'),
      configService.get<string>('SUPABASE_SERVICE_ROLE_KEY'),
    );
  }
  decodeToken(token: string): any {
    try {
      return jwt.decode(token); // No se verifica la firma, solo se extrae la información
    } catch (error) {
      throw new UnauthorizedException('Invalid token format', error);
    }
  }

  async validateUser(token: string): Promise<any> {
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      const { data, error } = await this.supabase.auth.getUser(token);
      if (error || !data.user) {
        throw new UnauthorizedException('Invalid token');
      }
      return data.user;
    }
    return this.decodeToken(token);
  }
}
