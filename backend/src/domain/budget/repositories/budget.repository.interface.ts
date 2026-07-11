import { BudgetEntity } from '../entities/budget.entity';

export const BUDGET_REPOSITORY = Symbol('BUDGET_REPOSITORY');

export interface BudgetSummary {
  id: number;
  correlativo: number | null;
  createdAt: Date;
  clientName: string;
  total: number;
  status: string;
  currentStep: number;
}

export interface IBudgetRepository {
  findAll(): Promise<BudgetSummary[]>;
  findById(id: number): Promise<BudgetEntity | null>;
  findNextCorrelativo(): Promise<number>;
  create(data: Partial<BudgetEntity>): Promise<BudgetEntity>;
  update(id: number, data: Partial<BudgetEntity>): Promise<BudgetEntity>;
  remove(id: number): Promise<void>;
}
