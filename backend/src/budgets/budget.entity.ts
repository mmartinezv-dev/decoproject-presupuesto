import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { BudgetItem } from './budget-item.entity';

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

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

  @OneToMany(() => BudgetItem, (item) => item.budget, {
    cascade: true,
    eager: true,
  })
  items: BudgetItem[];
}
