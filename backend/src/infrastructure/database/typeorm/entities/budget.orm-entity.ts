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

  @Column({ nullable: true })
  correlativo: number;

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

  @Column({ type: 'text' })
  notes: string;

  @Column({
    type: 'longtext',
    nullable: true,
    transformer: {
      to: (v: unknown) => JSON.stringify(v ?? []),
      from: (v: string) =>
        (v ? JSON.parse(v) : []) as {
          text: string;
          images: { src: string; caption: string }[];
        }[],
    },
  })
  visitFindings: { text: string; images: { src: string; caption: string }[] }[];

  @Column({ type: 'text' })
  visitSummary: string;

  @Column({ type: 'simple-json', nullable: true })
  preliminaryWorks: string[];

  @Column({ type: 'simple-json', nullable: true })
  specialAnnotations: { title: string; text: string }[];

  @Column({ type: 'simple-json', nullable: true })
  sections: { title: string; manualTotal: number | null }[];

  @Column({ type: 'longtext' })
  logo: string;

  @Column({
    type: 'longtext',
    nullable: true,
    transformer: {
      to: (v: unknown) => JSON.stringify(v ?? []),
      from: (v: string) =>
        (v ? JSON.parse(v) : []) as { src: string; caption: string }[],
    },
  })
  images: { src: string; caption: string }[];

  @Column('decimal', {
    precision: 14,
    scale: 2,
    default: 0,
    transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) },
  })
  neto: number;

  @Column('decimal', {
    precision: 14,
    scale: 2,
    default: 0,
    transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) },
  })
  iva: number;

  @Column('decimal', {
    precision: 14,
    scale: 2,
    default: 0,
    transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) },
  })
  total: number;

  @Column({ type: 'varchar', length: 10, default: 'borrador' })
  status: string;

  @Column({ type: 'int', default: 1 })
  currentStep: number;

  @OneToMany(() => BudgetItemOrmEntity, (item) => item.budget, {
    cascade: true,
    eager: true,
  })
  items: BudgetItemOrmEntity[];
}
