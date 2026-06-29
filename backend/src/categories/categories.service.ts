import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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
export class CategoriesService implements OnModuleInit {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  async onModuleInit(): Promise<void> {
    const count = await this.repo.count();
    if (count === 0) {
      await this.repo.save(DEFAULT_CATEGORIES.map((c) => this.repo.create(c)));
      this.logger.log('Categorías por defecto creadas');
    }
  }

  findAll(): Promise<Category[]> {
    return this.repo.find({ order: { sortOrder: 'ASC' } });
  }

  async findOne(id: number): Promise<Category> {
    const cat = await this.repo.findOneBy({ id });
    if (!cat) throw new NotFoundException(`Categoría #${id} no encontrada`);
    return cat;
  }

  create(dto: CreateCategoryDto): Promise<Category> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const cat = await this.findOne(id);
    Object.assign(cat, dto);
    return this.repo.save(cat);
  }

  async remove(id: number): Promise<void> {
    const cat = await this.findOne(id);
    await this.repo.remove(cat);
  }
}
