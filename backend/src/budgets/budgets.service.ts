import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  private readonly logger = new Logger(BudgetsService.name);

  constructor(
    @InjectRepository(Budget)
    private readonly repo: Repository<Budget>,
  ) {}

  findAll(): Promise<Budget[]> {
    return this.repo.find({
      order: { createdAt: 'DESC' },
      select: { id: true, createdAt: true, clientName: true, total: true },
    });
  }

  async findOne(id: number): Promise<Budget> {
    const budget = await this.repo.findOne({
      where: { id },
      relations: { items: true },
    });
    if (!budget) {
      throw new NotFoundException(`Presupuesto #${id} no encontrado`);
    }
    return budget;
  }

  create(dto: CreateBudgetDto): Promise<Budget> {
    this.logger.log(`Creando presupuesto para cliente: ${dto.clientName || 'Sin cliente'}`);
    const budget = this.repo.create(dto as Partial<Budget>);
    return this.repo.save(budget);
  }

  async update(id: number, dto: UpdateBudgetDto): Promise<Budget> {
    const budget = await this.findOne(id);
    // Eliminar items previos para reemplazar con los nuevos
    budget.items = [];
    Object.assign(budget, dto);
    this.logger.log(`Actualizando presupuesto #${id}`);
    return this.repo.save(budget);
  }

  async remove(id: number): Promise<void> {
    const budget = await this.findOne(id);
    await this.repo.remove(budget);
    this.logger.log(`Presupuesto #${id} eliminado`);
  }
}
