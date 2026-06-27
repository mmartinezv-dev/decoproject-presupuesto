import { ClientEntity } from '../entities/client.entity';

export const CLIENT_REPOSITORY = Symbol('CLIENT_REPOSITORY');

export interface IClientRepository {
  findAll(): Promise<ClientEntity[]>;
  findById(id: number): Promise<ClientEntity | null>;
  create(data: Partial<ClientEntity>): Promise<ClientEntity>;
  update(id: number, data: Partial<ClientEntity>): Promise<ClientEntity>;
  remove(id: number): Promise<void>;
}
