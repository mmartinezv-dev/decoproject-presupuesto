import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { randomUUID } from 'crypto';
import { RefreshTokenOrmEntity } from '../database/typeorm/entities/refresh-token.orm-entity';

@Injectable()
export class RefreshTokenStore {
  constructor(
    @InjectRepository(RefreshTokenOrmEntity)
    private readonly repo: Repository<RefreshTokenOrmEntity>,
  ) {}

  async issue(ttlSeconds = 604800): Promise<string> {
    const jti = randomUUID();
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    await this.repo.save({ jti, expiresAt });
    await this.repo.delete({ expiresAt: LessThan(new Date()) });
    return jti;
  }

  async rotate(oldJti: string, ttlSeconds = 604800): Promise<string | null> {
    const existing = await this.repo.findOne({ where: { jti: oldJti } });
    if (!existing || existing.expiresAt < new Date()) {
      if (existing) await this.repo.delete({ jti: oldJti });
      return null;
    }
    await this.repo.delete({ jti: oldJti });
    return this.issue(ttlSeconds);
  }

  async revoke(jti: string): Promise<void> {
    await this.repo.delete({ jti });
  }
}
