import { Controller, Post, Body } from '@nestjs/common';
import { IsString } from 'class-validator';
import { AuthApplicationService } from '../../../application/auth/auth.application-service';
import { Public } from '../decorators/public.decorator';

class LoginDto {
  @IsString() username: string;
  @IsString() password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthApplicationService) {}

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.username, dto.password);
  }
}
