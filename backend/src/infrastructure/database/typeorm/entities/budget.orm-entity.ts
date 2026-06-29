import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { BudgetItemOrmEntity } from './budget-item.orm-entity';

@Entity('budget')
@Index('IDX_budget_clientRut', ['clientRut'])
@Index('IDX_budget_createdAt', ['createdAt'])
export class BudgetOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @Column({ default: '' })
  companyName: string;

  @Column({ default: '' })
  companyRut: string;

  @Column({ default: '' })
  companyAddress: string;

  @Column({ default: '' })
  companyPhone: string;

  @Column({ nullable: true })
  clientId: number;

  @Column({ default: '' })
  clientName: string;

  @Column({ default: '' })
  clientRut: string;

  @Column({ default: '' })
  clientAddress: string;

  @Column({ default: '' })
  clientPhone: string;

  @Column({ type: 'text', default: '' })
  notes: string;

  @Column({ type: 'simple-json', nullable: true, default: '[]' })
  visitFindings: { text: string; images: { src: string; caption: string }[] }[];

  @Column({ type: 'text', default: '' })
  visitSummary: string;

  @Column({ type: 'simple-json', nullable: true, default: '[]' })
  preliminaryWorks: string[];

  @Column({ type: 'text', default: '' })
  logo: string;

  @Column({ type: 'simple-json', nullable: true, default: '[]' })
  images: { src: string; caption: string }[];

  @Column('decimal', { precision: 14, scale: 2, default: 0 })
  neto: number;

  @Column('decimal', { precision: 14, scale: 2, default: 0 })
  iva: number;

  @Column('decimal', { precision: 14, scale: 2, default: 0 })
  total: number;

  @OneToMany(() => BudgetItemOrmEntity, (item) => item.budget, {
    cascade: true,
    eager: true,
  })
  items: BudgetItemOrmEntity[];
}
