import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './presentation/modules/auth.module';
import { CategoryModule } from './presentation/modules/category.module';
import { ProductModule } from './presentation/modules/product.module';
import { ClientModule } from './presentation/modules/client.module';
import { BudgetModule } from './presentation/modules/budget.module';

const frontendPath = join(__dirname, '..', '..', 'frontend', 'dist');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER ?? 'decoproject',
      password: process.env.DB_PASS ?? '',
      database: process.env.DB_NAME ?? 'decoproject',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: frontendPath,
    }),
    AuthModule,
    CategoryModule,
    ProductModule,
    ClientModule,
    BudgetModule,
  ],
})
export class AppModule {}
