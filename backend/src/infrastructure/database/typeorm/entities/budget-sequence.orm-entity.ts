import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('budget_sequence')
export class BudgetSequenceOrmEntity {
  @PrimaryColumn({ type: 'tinyint' })
  id: number;

  @Column({ type: 'int' })
  nextValue: number;
}
