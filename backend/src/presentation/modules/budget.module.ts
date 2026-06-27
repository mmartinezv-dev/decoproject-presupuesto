import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetOrmEntity } from '../../infrastructure/database/typeorm/entities/budget.orm-entity';
import { BudgetItemOrmEntity } from '../../infrastructure/database/typeorm/entities/budget-item.orm-entity';
import { BudgetTypeOrmRepository } from '../../infrastructure/database/typeorm/repositories/budget.typeorm-repository';
import { BUDGET_REPOSITORY } from '../../domain/budget/repositories/budget.repository.interface';
import { BudgetApplicationService } from '../../application/budget/budget.application-service';
import { BudgetsController } from '../http/controllers/budgets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BudgetOrmEntity, BudgetItemOrmEntity])],
  providers: [
    { provide: BUDGET_REPOSITORY, useClass: BudgetTypeOrmRepository },
    BudgetApplicationService,
  ],
  controllers: [BudgetsController],
})
export class BudgetModule {}
