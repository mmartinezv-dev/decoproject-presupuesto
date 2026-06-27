import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './presentation/modules/auth.module';
import { CategoryModule } from './presentation/modules/category.module';
import { ProductModule } from './presentation/modules/product.module';
import { ClientModule } from './presentation/modules/client.module';
import { BudgetModule } from './presentation/modules/budget.module';
import { getTypeOrmConfig } from './infrastructure/config/typeorm.config';

const frontendPath = join(__dirname, '..', '..', 'frontend', 'dist');

@Module({
  imports: [
    TypeOrmModule.forRoot(getTypeOrmConfig()),
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
