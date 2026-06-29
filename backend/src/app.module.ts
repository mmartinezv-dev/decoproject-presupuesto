import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './presentation/modules/auth.module';
import { CategoryModule } from './presentation/modules/category.module';
import { ProductModule } from './presentation/modules/product.module';
import { ClientModule } from './presentation/modules/client.module';
import { BudgetModule } from './presentation/modules/budget.module';
import { UploadsModule } from './presentation/modules/uploads.module';
import { getTypeOrmConfig } from './infrastructure/config/typeorm.config';

const frontendPath = join(__dirname, '..', '..', 'frontend', 'dist');

@Module({
  imports: [
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    ServeStaticModule.forRoot({
      rootPath: frontendPath,
      exclude: ['/api/{*path}', '/uploads/{*path}'],
    }),
    AuthModule,
    CategoryModule,
    ProductModule,
    ClientModule,
    BudgetModule,
    UploadsModule,
  ],
})
export class AppModule {}
