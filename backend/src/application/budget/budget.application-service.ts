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
    return this.budgetRepository.create(this.prepareFinancialData(dto));
  }

  async update(id: number, dto: Partial<BudgetEntity>): Promise<BudgetEntity> {
    await this.findOne(id);
    this.logger.log(`Actualizando presupuesto #${id}`);
    return this.budgetRepository.update(id, this.prepareFinancialData(dto));
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.budgetRepository.remove(id);
    this.logger.log(`Presupuesto #${id} eliminado`);
  }

  private prepareFinancialData(
    dto: Partial<BudgetEntity>,
  ): Partial<BudgetEntity> {
    if (dto.items === undefined && dto.sections === undefined) return dto;

    const items = (dto.items ?? []).map((item) => ({
      ...item,
      subtotal: this.roundMoney(item.quantity * item.price),
    }));

    let neto = 0;
    if (dto.sections?.length) {
      const calculatedTotals = dto.sections.map(() => 0);
      for (const item of items) {
        const index =
          item.sectionIndex !== undefined && item.sectionIndex !== null
            ? item.sectionIndex
            : dto.sections.findIndex(
                (section) => section.title === item.section,
              );
        if (index >= 0 && index < calculatedTotals.length) {
          calculatedTotals[index] += item.subtotal;
        }
      }
      neto = dto.sections.reduce(
        (sum, section, index) =>
          sum + (section.manualTotal ?? calculatedTotals[index]),
        0,
      );
    } else {
      const sectionTotals = new Map<
        string,
        { calculated: number; manual: number | null }
      >();
      for (const item of items) {
        const key = item.section || 'Productos';
        const current = sectionTotals.get(key) ?? {
          calculated: 0,
          manual: null,
        };
        current.calculated += item.subtotal;
        if (item.sectionManualTotal !== undefined) {
          current.manual = item.sectionManualTotal;
        }
        sectionTotals.set(key, current);
      }
      neto = [...sectionTotals.values()].reduce(
        (sum, section) => sum + (section.manual ?? section.calculated),
        0,
      );
    }

    neto = this.roundMoney(neto);
    const iva = Math.round(neto * 0.19);
    return {
      ...dto,
      items,
      neto,
      iva,
      total: this.roundMoney(neto + iva),
    };
  }

  private roundMoney(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
