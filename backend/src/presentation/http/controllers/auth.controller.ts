import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { IsString, IsNotEmpty } from 'class-validator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthApplicationService } from '../../../application/auth/auth.application-service';
import { Public } from '../decorators/public.decorator';

class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

const REFRESH_COOKIE = 'refresh_token';

function cookieOpts() {
  return {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: (Number(process.env.JWT_REFRESH_EXPIRES) || 604800) * 1000,
    path: '/api/auth',
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthApplicationService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Retorna access token' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(
      dto.username,
      dto.password,
    );
    res.cookie(REFRESH_COOKIE, refreshToken, cookieOpts());
    return { accessToken };
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Renovar access token' })
  @ApiResponse({ status: 200 })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookies = req.cookies as Record<string, string> | undefined;
    const oldToken = cookies?.[REFRESH_COOKIE];
    if (!oldToken) throw new UnauthorizedException('No refresh token');
    const { accessToken, refreshToken } =
      await this.authService.refresh(oldToken);
    res.cookie(REFRESH_COOKIE, refreshToken, cookieOpts());
    return { accessToken };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiBearerAuth('access-token')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const cookies = req.cookies as Record<string, string> | undefined;
    const token = cookies?.[REFRESH_COOKIE];
    if (token) await this.authService.logout(token);
    res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' });
    return { ok: true };
  }
}
