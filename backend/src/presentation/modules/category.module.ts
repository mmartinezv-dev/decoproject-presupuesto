import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryOrmEntity } from '../../infrastructure/database/typeorm/entities/category.orm-entity';
import { CategoryTypeOrmRepository } from '../../infrastructure/database/typeorm/repositories/category.typeorm-repository';
import { CATEGORY_REPOSITORY } from '../../domain/category/repositories/category.repository.interface';
import { CategoryApplicationService } from '../../application/category/category.application-service';
import { CategoriesController } from '../http/controllers/categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryOrmEntity])],
  providers: [
    { provide: CATEGORY_REPOSITORY, useClass: CategoryTypeOrmRepository },
    CategoryApplicationService,
  ],
  controllers: [CategoriesController],
})
export class CategoryModule {}
