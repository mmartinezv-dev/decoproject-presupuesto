import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CategoryOrmEntity } from './category.orm-entity';

@Entity()
export class ProductOrmEntity {
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

  @ManyToOne(() => CategoryOrmEntity, { nullable: true, eager: true })
  category: CategoryOrmEntity;

  @Column({ nullable: true })
  categoryId: number;
}
