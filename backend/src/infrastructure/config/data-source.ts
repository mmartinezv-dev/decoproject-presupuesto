import 'dotenv/config';
import { DataSource } from 'typeorm';
import { join } from 'path';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER ?? 'decoproject',
  password: process.env.DB_PASS ?? '',
  database: process.env.DB_NAME ?? 'decoproject',
  entities: [join(__dirname, '../database/typeorm/entities/*.orm-entity.{ts,js}')],
  migrations: [join(__dirname, '../database/migrations/*.{ts,js}')],
  synchronize: false,
  logging: true,
});
