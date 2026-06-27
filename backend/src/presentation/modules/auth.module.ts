import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthApplicationService } from '../../application/auth/auth.application-service';
import { AuthController } from '../http/controllers/auth.controller';
import { JwtAuthGuard } from '../http/guards/jwt-auth.guard';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    AuthApplicationService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
