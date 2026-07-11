import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetOrmEntity } from '../entities/budget.orm-entity';
import {
  IBudgetRepository,
  BudgetSummary,
} from '../../../../domain/budget/repositories/budget.repository.interface';
import { BudgetEntity } from '../../../../domain/budget/entities/budget.entity';

@Injectable()
export class BudgetTypeOrmRepository implements IBudgetRepository {
  constructor(
    @InjectRepository(BudgetOrmEntity)
    private readonly repo: Repository<BudgetOrmEntity>,
  ) {}

  findAll(): Promise<BudgetSummary[]> {
    return this.repo.find({
      order: { createdAt: 'DESC' },
      select: {
        id: true,
        correlativo: true,
        createdAt: true,
        clientName: true,
        total: true,
        status: true,
        currentStep: true,
      },
    });
  }

  findById(id: number): Promise<BudgetEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: { items: true },
    });
  }

  async findNextCorrelativo(): Promise<number> {
    const [latest] = await this.repo.find({
      select: { correlativo: true },
      order: { correlativo: 'DESC' },
      take: 1,
      withDeleted: true,
    });
    return (latest?.correlativo ?? 0) + 1;
  }

  async create(data: Partial<BudgetEntity>): Promise<BudgetEntity> {
    const shouldFinalize = data.status === 'final';

    const budget = this.repo.create({
      ...(data as Partial<BudgetOrmEntity>),
      correlativo: shouldFinalize
        ? await this.findNextCorrelativo()
        : undefined,
      status: data.status ?? 'borrador',
    });
    return this.repo.save(budget);
  }

  async update(id: number, data: Partial<BudgetEntity>): Promise<BudgetEntity> {
    const budget = await this.repo.findOne({
      where: { id },
      relations: { items: true },
    });

    const isFinalizing =
      data.status === 'final' && budget!.status === 'borrador';

    budget!.items = [];
    Object.assign(budget!, data);

    if (isFinalizing && !budget!.correlativo) {
      budget!.correlativo = await this.findNextCorrelativo();
    }

    return this.repo.save(budget!);
  }

  async remove(id: number): Promise<void> {
    const budget = await this.repo.findOne({
      where: { id },
      relations: { items: true },
    });
    await this.repo.remove(budget!);
  }
}
