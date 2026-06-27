import { CategoryEntity } from '../entities/category.entity';

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');

export interface ICategoryRepository {
  count(): Promise<number>;
  saveMany(data: Partial<CategoryEntity>[]): Promise<CategoryEntity[]>;
  findAll(): Promise<CategoryEntity[]>;
  findById(id: number): Promise<CategoryEntity | null>;
  create(data: Partial<CategoryEntity>): Promise<CategoryEntity>;
  update(id: number, data: Partial<CategoryEntity>): Promise<CategoryEntity>;
  remove(id: number): Promise<void>;
}
