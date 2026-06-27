import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: '' })
  rut: string;

  @Column({ default: '' })
  address: string;

  @Column({ default: '' })
  phone: string;
}
