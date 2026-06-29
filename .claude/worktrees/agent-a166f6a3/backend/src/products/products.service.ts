import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  search(query: string): Promise<Product[]> {
    return this.repo.find({
      where: { name: Like(`%${query}%`) },
      take: 20,
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.repo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Producto #${id} no encontrado`);
    }
    return product;
  }

  create(dto: CreateProductDto): Promise<Product> {
    this.logger.log(`Creando producto: ${dto.name}`);
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    this.logger.log(`Actualizando producto #${id}`);
    return this.repo.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.repo.remove(product);
    this.logger.log(`Producto #${id} eliminado`);
  }
}
