import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export function getTypeOrmConfig(): TypeOrmModuleOptions {
  const ephemeralTestDatabase =
    process.env.NODE_ENV === 'test' && process.env.DB_SYNCHRONIZE === 'true';

  return {
    type: 'mysql',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER ?? 'decoproject',
    password: process.env.DB_PASS ?? '',
    database: process.env.DB_NAME ?? 'decoproject',
    autoLoadEntities: true,
    synchronize: ephemeralTestDatabase,
    dropSchema: ephemeralTestDatabase && process.env.DB_DROP_SCHEMA === 'true',
    migrations: [join(__dirname, '../database/migrations/*.{ts,js}')],
    migrationsRun: false,
  };
}
