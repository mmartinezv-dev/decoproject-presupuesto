import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from '../../infrastructure/database/typeorm/entities/product.orm-entity';
import { ProductTypeOrmRepository } from '../../infrastructure/database/typeorm/repositories/product.typeorm-repository';
import { PRODUCT_REPOSITORY } from '../../domain/product/repositories/product.repository.interface';
import { ProductApplicationService } from '../../application/product/product.application-service';
import { ProductsController } from '../http/controllers/products.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
  providers: [
    { provide: PRODUCT_REPOSITORY, useClass: ProductTypeOrmRepository },
    ProductApplicationService,
  ],
  controllers: [ProductsController],
})
export class ProductModule {}
