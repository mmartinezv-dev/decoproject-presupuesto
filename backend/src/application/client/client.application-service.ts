import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { CLIENT_REPOSITORY } from '../../domain/client/repositories/client.repository.interface';
import type { IClientRepository } from '../../domain/client/repositories/client.repository.interface';
import type { ClientEntity } from '../../domain/client/entities/client.entity';

@Injectable()
export class ClientApplicationService {
  private readonly logger = new Logger(ClientApplicationService.name);

  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  findAll(): Promise<ClientEntity[]> {
    return this.clientRepository.findAll();
  }

  async findOne(id: number): Promise<ClientEntity> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new NotFoundException(`Cliente #${id} no encontrado`);
    }
    return client;
  }

  create(dto: Partial<ClientEntity>): Promise<ClientEntity> {
    this.logger.log(`Creando cliente: ${dto.name}`);
    return this.clientRepository.create(dto);
  }

  async update(id: number, dto: Partial<ClientEntity>): Promise<ClientEntity> {
    await this.findOne(id);
    this.logger.log(`Actualizando cliente #${id}`);
    return this.clientRepository.update(id, dto);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.clientRepository.remove(id);
    this.logger.log(`Cliente #${id} eliminado`);
  }
}
