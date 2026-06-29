import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Budget } from './budget.entity';

@Entity()
export class BudgetItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Budget, (b) => b.items, { onDelete: 'CASCADE' })
  budget: Budget;

  @Column()
  productName: string;

  @Column({ default: '' })
  section: string;

  @Column({ default: 'un' })
  unit: string;

  @Column('decimal', { precision: 12, scale: 2 })
  quantity: number;

  @Column('decimal', { precision: 12, scale: 2 })
  price: number;

  @Column('decimal', { precision: 14, scale: 2 })
  subtotal: number;
}
