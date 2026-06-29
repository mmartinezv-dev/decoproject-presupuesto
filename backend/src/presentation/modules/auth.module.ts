import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthApplicationService } from '../../application/auth/auth.application-service';
import { AuthController } from '../http/controllers/auth.controller';
import { JwtAuthGuard } from '../http/guards/jwt-auth.guard';
import { RefreshTokenStore } from '../../infrastructure/auth/refresh-token.store';
import { RefreshTokenOrmEntity } from '../../infrastructure/database/typeorm/entities/refresh-token.orm-entity';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([RefreshTokenOrmEntity]),
  ],
  providers: [
    AuthApplicationService,
    RefreshTokenStore,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
