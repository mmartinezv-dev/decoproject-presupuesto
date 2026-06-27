import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export function getTypeOrmConfig(): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER ?? 'decoproject',
    password: process.env.DB_PASS ?? '',
    database: process.env.DB_NAME ?? 'decoproject',
    autoLoadEntities: true,
    synchronize: false,
    migrations: [join(__dirname, '../database/migrations/*.{ts,js}')],
    migrationsRun: false,
  };
}
