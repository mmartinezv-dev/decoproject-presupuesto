import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('client')
@Index('IDX_client_rut', ['rut'])
export class ClientOrmEntity {
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
