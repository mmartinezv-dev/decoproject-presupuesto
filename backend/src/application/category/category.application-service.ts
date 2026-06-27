import { Injectable, Inject, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../../domain/category/repositories/category.repository.interface';
import type { ICategoryRepository } from '../../domain/category/repositories/category.repository.interface';
import type { CategoryEntity } from '../../domain/category/entities/category.entity';

const DEFAULT_CATEGORIES = [
  { name: 'Obras Preliminares', sortOrder: 1 },
  { name: 'Movimiento de Tierras', sortOrder: 2 },
  { name: 'Hormigón', sortOrder: 3 },
  { name: 'Albañilería y Tabiques', sortOrder: 4 },
  { name: 'Cubierta y Techumbre', sortOrder: 5 },
  { name: 'Instalaciones', sortOrder: 6 },
  { name: 'Terminaciones', sortOrder: 7 },
  { name: 'Carpintería', sortOrder: 8 },
  { name: 'Obras Exteriores', sortOrder: 9 },
];

@Injectable()
export class CategoryApplicationService implements OnModuleInit {
  private readonly logger = new Logger(CategoryApplicationService.name);

  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async onModuleInit(): Promise<void> {
    const count = await this.categoryRepository.count();
    if (count === 0) {
      await this.categoryRepository.saveMany(DEFAULT_CATEGORIES);
      this.logger.log('Categorías por defecto creadas');
    }
  }

  findAll(): Promise<CategoryEntity[]> {
    return this.categoryRepository.findAll();
  }

  async findOne(id: number): Promise<CategoryEntity> {
    const cat = await this.categoryRepository.findById(id);
    if (!cat) throw new NotFoundException(`Categoría #${id} no encontrada`);
    return cat;
  }

  create(dto: Partial<CategoryEntity>): Promise<CategoryEntity> {
    return this.categoryRepository.create(dto);
  }

  async update(id: number, dto: Partial<CategoryEntity>): Promise<CategoryEntity> {
    await this.findOne(id);
    return this.categoryRepository.update(id, dto);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.categoryRepository.remove(id);
  }
}
