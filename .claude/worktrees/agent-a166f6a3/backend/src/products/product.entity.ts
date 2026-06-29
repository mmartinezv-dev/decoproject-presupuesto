import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: 'un' })
  unit: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  price: number;

  @ManyToOne(() => Category, { nullable: true, eager: true })
  category: Category;

  @Column({ nullable: true })
  categoryId: number;
}
