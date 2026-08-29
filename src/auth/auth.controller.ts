import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators/public.decorator';
import {
  clearAuthCookie,
  extractAuthToken,
  setAuthCookie,
} from '../common/auth-cookie';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 8, ttl: 60000 } })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);
    setAuthCookie(res, result.token);
    return result;
  }

  @Public()
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    clearAuthCookie(res);
    return { ok: true };
  }

  @Get('me')
  me(@Req() req: Request) {
    return this.authService.me(extractAuthToken(req));
  }
}
