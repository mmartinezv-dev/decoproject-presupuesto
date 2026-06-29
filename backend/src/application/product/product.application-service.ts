import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/product/repositories/product.repository.interface';
import type { IProductRepository } from '../../domain/product/repositories/product.repository.interface';
import type { ProductEntity } from '../../domain/product/entities/product.entity';

@Injectable()
export class ProductApplicationService {
  private readonly logger = new Logger(ProductApplicationService.name);

  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  findAll(): Promise<ProductEntity[]> {
    return this.productRepository.findAll();
  }

  search(query: string): Promise<ProductEntity[]> {
    return this.productRepository.search(query);
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Producto #${id} no encontrado`);
    }
    return product;
  }

  create(dto: Partial<ProductEntity>): Promise<ProductEntity> {
    this.logger.log(`Creando producto: ${dto.name}`);
    return this.productRepository.create(dto);
  }

  async update(
    id: number,
    dto: Partial<ProductEntity>,
  ): Promise<ProductEntity> {
    await this.findOne(id);
    this.logger.log(`Actualizando producto #${id}`);
    return this.productRepository.update(id, dto);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.productRepository.remove(id);
    this.logger.log(`Producto #${id} eliminado`);
  }
}
