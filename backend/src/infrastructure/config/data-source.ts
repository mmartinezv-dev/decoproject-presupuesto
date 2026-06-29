import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(__dirname, '..', '..', '..', '.env') });

import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER ?? 'decoproject',
  password: process.env.DB_PASS ?? '',
  database: process.env.DB_NAME ?? 'decoproject',
  entities: [
    join(__dirname, '../database/typeorm/entities/*.orm-entity.{ts,js}'),
  ],
  migrations: [join(__dirname, '../database/migrations/*.{ts,js}')],
  synchronize: false,
  logging: true,
});
