import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('refresh_token')
export class RefreshTokenOrmEntity {
  @PrimaryColumn({ length: 36 })
  jti: string;

  @Column({ type: 'datetime' })
  expiresAt: Date;
}
