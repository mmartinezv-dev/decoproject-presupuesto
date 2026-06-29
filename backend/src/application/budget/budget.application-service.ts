import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { BUDGET_REPOSITORY } from '../../domain/budget/repositories/budget.repository.interface';
import type {
  IBudgetRepository,
  BudgetSummary,
} from '../../domain/budget/repositories/budget.repository.interface';
import type { BudgetEntity } from '../../domain/budget/entities/budget.entity';

@Injectable()
export class BudgetApplicationService {
  private readonly logger = new Logger(BudgetApplicationService.name);

  constructor(
    @Inject(BUDGET_REPOSITORY)
    private readonly budgetRepository: IBudgetRepository,
  ) {}

  findAll(): Promise<BudgetSummary[]> {
    return this.budgetRepository.findAll();
  }

  async findOne(id: number): Promise<BudgetEntity> {
    const budget = await this.budgetRepository.findById(id);
    if (!budget) {
      throw new NotFoundException(`Presupuesto #${id} no encontrado`);
    }
    return budget;
  }

  create(dto: Partial<BudgetEntity>): Promise<BudgetEntity> {
    this.logger.log(
      `Creando presupuesto para cliente: ${dto.clientName || 'Sin cliente'}`,
    );
    return this.budgetRepository.create(dto);
  }

  async update(id: number, dto: Partial<BudgetEntity>): Promise<BudgetEntity> {
    await this.findOne(id);
    this.logger.log(`Actualizando presupuesto #${id}`);
    return this.budgetRepository.update(id, dto);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.budgetRepository.remove(id);
    this.logger.log(`Presupuesto #${id} eliminado`);
  }
}
