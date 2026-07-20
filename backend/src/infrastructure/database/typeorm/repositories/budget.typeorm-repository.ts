import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { BudgetOrmEntity } from '../entities/budget.orm-entity';
import { BudgetItemOrmEntity } from '../entities/budget-item.orm-entity';
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
    });
  }

  async findNextCorrelativo(): Promise<number> {
    const result: unknown = await this.repo.manager.query(
      'SELECT `nextValue` FROM `budget_sequence` WHERE `id` = 1',
    );
    const row = Array.isArray(result)
      ? (result[0] as Record<string, unknown> | undefined)
      : undefined;
    return Number(row?.nextValue ?? 1);
  }

  async create(data: Partial<BudgetEntity>): Promise<BudgetEntity> {
    return this.repo.manager.transaction(async (manager) => {
      const repository = manager.getRepository(BudgetOrmEntity);
      const shouldFinalize = data.status === 'final';
      const budget = repository.create({
        ...(data as Partial<BudgetOrmEntity>),
        notes: data.notes ?? '',
        visitFindings: data.visitFindings ?? [],
        visitSummary: data.visitSummary ?? '',
        preliminaryWorks: data.preliminaryWorks ?? [],
        specialAnnotations: data.specialAnnotations ?? [],
        sections: data.sections ?? [],
        logo: data.logo ?? '',
        images: data.images ?? [],
        items: (data.items ?? []) as BudgetItemOrmEntity[],
        correlativo: shouldFinalize
          ? await this.reserveNextCorrelativo(manager)
          : undefined,
        status: data.status ?? 'borrador',
      });
      return this.cleanBudget(await repository.save(budget));
    });
  }

  async update(id: number, data: Partial<BudgetEntity>): Promise<BudgetEntity> {
    return this.repo.manager.transaction(async (manager) => {
      const repository = manager.getRepository(BudgetOrmEntity);
      const itemRepository = manager.getRepository(BudgetItemOrmEntity);
      const budget = await repository.findOne({ where: { id } });
      if (!budget) {
        throw new NotFoundException(`Presupuesto #${id} no encontrado`);
      }

      const isFinalizing =
        data.status === 'final' && budget.status === 'borrador';
      const { items, ...plainData } = data;
      Object.assign(budget, plainData);

      if (items !== undefined) {
        await itemRepository
          .createQueryBuilder()
          .delete()
          .where('budgetId = :id', { id })
          .execute();
        budget.items = items.map((item) => {
          const itemEntity = itemRepository.create(item);
          itemEntity.budget = budget;
          return itemEntity;
        });
      }

      if (isFinalizing && !budget.correlativo) {
        budget.correlativo = await this.reserveNextCorrelativo(manager);
      }

      return this.cleanBudget(await repository.save(budget));
    });
  }

  async remove(id: number): Promise<void> {
    const budget = await this.repo.findOne({
      where: { id },
    });
    await this.repo.remove(budget!);
  }

  private async reserveNextCorrelativo(
    manager: EntityManager,
  ): Promise<number> {
    const result: unknown = await manager.query(
      'SELECT `nextValue` FROM `budget_sequence` WHERE `id` = 1 FOR UPDATE',
    );
    const row = Array.isArray(result)
      ? (result[0] as Record<string, unknown> | undefined)
      : undefined;
    const nextValue = Number(row?.nextValue);
    if (!Number.isSafeInteger(nextValue) || nextValue < 1) {
      throw new Error('Secuencia de correlativos no inicializada');
    }
    await manager.query(
      'UPDATE `budget_sequence` SET `nextValue` = ? WHERE `id` = 1',
      [nextValue + 1],
    );
    return nextValue;
  }

  private cleanBudget(budget: BudgetOrmEntity): BudgetEntity {
    budget.items?.forEach((item) => {
      delete (item as Partial<BudgetItemOrmEntity>).budget;
    });
    return budget;
  }
}
