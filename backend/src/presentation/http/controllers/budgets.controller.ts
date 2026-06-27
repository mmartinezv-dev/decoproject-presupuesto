import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { BudgetApplicationService } from '../../../application/budget/budget.application-service';
import { CreateBudgetDto } from '../dtos/budget/create-budget.dto';
import { UpdateBudgetDto } from '../dtos/budget/update-budget.dto';

@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetApplicationService) {}

  @Get()
  findAll() {
    return this.budgetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.budgetsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateBudgetDto) {
    return this.budgetsService.create(dto as any);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBudgetDto) {
    return this.budgetsService.update(id, dto as any);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.budgetsService.remove(id);
  }
}
