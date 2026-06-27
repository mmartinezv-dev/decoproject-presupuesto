import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProductsModule } from './products/products.module';
import { ClientsModule } from './clients/clients.module';
import { BudgetsModule } from './budgets/budgets.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';

const dbPath = join(__dirname, '..', 'database.sqlite');
const frontendPath = join(__dirname, '..', '..', 'frontend', 'dist');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: dbPath,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: frontendPath,
    }),
    AuthModule,
    CategoriesModule,
    ProductsModule,
    ClientsModule,
    BudgetsModule,
  ],
})
export class AppModule {}
