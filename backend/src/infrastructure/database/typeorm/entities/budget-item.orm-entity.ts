import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { BudgetOrmEntity } from './budget.orm-entity';

@Entity('budget_item')
export class BudgetItemOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BudgetOrmEntity, (b) => b.items, { onDelete: 'CASCADE' })
  budget: BudgetOrmEntity;

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
