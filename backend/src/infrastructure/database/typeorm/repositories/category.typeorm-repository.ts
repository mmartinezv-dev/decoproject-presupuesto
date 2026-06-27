import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryOrmEntity } from '../entities/category.orm-entity';
import { ICategoryRepository } from '../../../../domain/category/repositories/category.repository.interface';
import { CategoryEntity } from '../../../../domain/category/entities/category.entity';

@Injectable()
export class CategoryTypeOrmRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(CategoryOrmEntity)
    private readonly repo: Repository<CategoryOrmEntity>,
  ) {}

  count(): Promise<number> {
    return this.repo.count();
  }

  async saveMany(data: Partial<CategoryEntity>[]): Promise<CategoryEntity[]> {
    const entities = data.map((c) => this.repo.create(c as Partial<CategoryOrmEntity>));
    return this.repo.save(entities) as Promise<CategoryEntity[]>;
  }

  findAll(): Promise<CategoryEntity[]> {
    return this.repo.find({ order: { sortOrder: 'ASC' } }) as Promise<CategoryEntity[]>;
  }

  findById(id: number): Promise<CategoryEntity | null> {
    return this.repo.findOneBy({ id }) as Promise<CategoryEntity | null>;
  }

  create(data: Partial<CategoryEntity>): Promise<CategoryEntity> {
    return this.repo.save(this.repo.create(data as Partial<CategoryOrmEntity>)) as Promise<CategoryEntity>;
  }

  async update(id: number, data: Partial<CategoryEntity>): Promise<CategoryEntity> {
    const cat = await this.repo.findOneBy({ id });
    Object.assign(cat!, data);
    return this.repo.save(cat!) as unknown as Promise<CategoryEntity>;
  }

  async remove(id: number): Promise<void> {
    const cat = await this.repo.findOneBy({ id });
    await this.repo.remove(cat!);
  }
}
