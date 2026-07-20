import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenStore } from '../../infrastructure/auth/refresh-token.store';
import { getRequiredEnvironment } from '../../infrastructure/config/environment.config';

@Injectable()
export class AuthApplicationService {
  constructor(
    private jwtService: JwtService,
    private refreshTokenStore: RefreshTokenStore,
  ) {}

  async login(
    username: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const validUser = getRequiredEnvironment('AUTH_USER');
    const validPass = getRequiredEnvironment('AUTH_PASS');

    if (username !== validUser || password !== validPass) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const ttl = Number(process.env.JWT_REFRESH_EXPIRES) || 604800;
    const jti = await this.refreshTokenStore.issue(ttl);
    const accessToken = this.jwtService.sign(
      { sub: username },
      {
        secret: getRequiredEnvironment('JWT_ACCESS_SECRET'),
        expiresIn: Number(process.env.JWT_ACCESS_EXPIRES) || 900,
      },
    );
    const refreshToken = this.jwtService.sign(
      { sub: username, jti },
      {
        secret: getRequiredEnvironment('JWT_REFRESH_SECRET'),
        expiresIn: ttl,
      },
    );
    return { accessToken, refreshToken };
  }

  async refresh(
    oldRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let payload: { sub: string; jti: string };
    try {
      payload = this.jwtService.verify(oldRefreshToken, {
        secret: getRequiredEnvironment('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const ttl = Number(process.env.JWT_REFRESH_EXPIRES) || 604800;
    const newJti = await this.refreshTokenStore.rotate(payload.jti, ttl);
    if (!newJti) throw new UnauthorizedException('Refresh token revocado');

    const accessToken = this.jwtService.sign(
      { sub: payload.sub },
      {
        secret: getRequiredEnvironment('JWT_ACCESS_SECRET'),
        expiresIn: Number(process.env.JWT_ACCESS_EXPIRES) || 900,
      },
    );
    const refreshToken = this.jwtService.sign(
      { sub: payload.sub, jti: newJti },
      {
        secret: getRequiredEnvironment('JWT_REFRESH_SECRET'),
        expiresIn: ttl,
      },
    );
    return { accessToken, refreshToken };
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const payload = this.jwtService.verify<{ jti: string }>(refreshToken, {
        secret: getRequiredEnvironment('JWT_REFRESH_SECRET'),
      });
      await this.refreshTokenStore.revoke(payload.jti);
    } catch {
      // token already invalid or expired — nothing to revoke
    }
  }
}
