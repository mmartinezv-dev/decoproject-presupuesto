import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CategoryOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ default: 0 })
  sortOrder: number;
}
