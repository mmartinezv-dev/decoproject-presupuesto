import { ProductEntity } from '../entities/product.entity';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface IProductRepository {
  findAll(): Promise<ProductEntity[]>;
  search(query: string): Promise<ProductEntity[]>;
  findById(id: number): Promise<ProductEntity | null>;
  create(data: Partial<ProductEntity>): Promise<ProductEntity>;
  update(id: number, data: Partial<ProductEntity>): Promise<ProductEntity>;
  remove(id: number): Promise<void>;
}
