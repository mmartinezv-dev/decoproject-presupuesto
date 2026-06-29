import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { IProductRepository } from '../../../../domain/product/repositories/product.repository.interface';
import { ProductEntity } from '../../../../domain/product/entities/product.entity';

@Injectable()
export class ProductTypeOrmRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repo: Repository<ProductOrmEntity>,
  ) {}

  findAll(): Promise<ProductEntity[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  search(query: string): Promise<ProductEntity[]> {
    return this.repo.find({
      where: { name: Like(`%${query}%`) },
      take: 20,
      order: { name: 'ASC' },
    });
  }

  findById(id: number): Promise<ProductEntity | null> {
    return this.repo.findOneBy({ id });
  }

  create(data: Partial<ProductEntity>): Promise<ProductEntity> {
    return this.repo.save(this.repo.create(data as Partial<ProductOrmEntity>));
  }

  async update(
    id: number,
    data: Partial<ProductEntity>,
  ): Promise<ProductEntity> {
    const product = await this.repo.findOneBy({ id });
    Object.assign(product!, data);
    return this.repo.save(product!);
  }

  async remove(id: number): Promise<void> {
    const product = await this.repo.findOneBy({ id });
    await this.repo.remove(product!);
  }
}
