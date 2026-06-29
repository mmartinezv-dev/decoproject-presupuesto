import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientOrmEntity } from '../entities/client.orm-entity';
import { IClientRepository } from '../../../../domain/client/repositories/client.repository.interface';
import { ClientEntity } from '../../../../domain/client/entities/client.entity';

@Injectable()
export class ClientTypeOrmRepository implements IClientRepository {
  constructor(
    @InjectRepository(ClientOrmEntity)
    private readonly repo: Repository<ClientOrmEntity>,
  ) {}

  findAll(): Promise<ClientEntity[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  findById(id: number): Promise<ClientEntity | null> {
    return this.repo.findOneBy({ id });
  }

  create(data: Partial<ClientEntity>): Promise<ClientEntity> {
    return this.repo.save(this.repo.create(data as Partial<ClientOrmEntity>));
  }

  async update(id: number, data: Partial<ClientEntity>): Promise<ClientEntity> {
    const client = await this.repo.findOneBy({ id });
    Object.assign(client!, data);
    return this.repo.save(client!);
  }

  async remove(id: number): Promise<void> {
    const client = await this.repo.findOneBy({ id });
    await this.repo.remove(client!);
  }
}
