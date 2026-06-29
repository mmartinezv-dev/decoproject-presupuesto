import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(username: string, password: string): { token: string } {
    const validUser = process.env.AUTH_USER ?? 'admin';
    const validPass = process.env.AUTH_PASS ?? 'decoproject2024';

    if (username !== validUser || password !== validPass) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const token = this.jwtService.sign(
      { sub: username },
      { secret: process.env.JWT_SECRET ?? 'decoproject-secret-key', expiresIn: '7d' },
    );
    return { token };
  }
}
