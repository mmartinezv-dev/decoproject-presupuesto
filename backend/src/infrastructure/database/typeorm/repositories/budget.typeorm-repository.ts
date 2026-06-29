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
      select: { id: true, createdAt: true, clientName: true, total: true },
    });
  }

  findById(id: number): Promise<BudgetEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: { items: true },
    });
  }

  create(data: Partial<BudgetEntity>): Promise<BudgetEntity> {
    const budget = this.repo.create(data as Partial<BudgetOrmEntity>);
    return this.repo.save(budget);
  }

  async update(id: number, data: Partial<BudgetEntity>): Promise<BudgetEntity> {
    const budget = await this.repo.findOne({
      where: { id },
      relations: { items: true },
    });

    budget!.items = [];
    Object.assign(budget!, data);
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
