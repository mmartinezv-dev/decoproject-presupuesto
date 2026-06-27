import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    @InjectRepository(Client)
    private readonly repo: Repository<Client>,
  ) {}

  findAll(): Promise<Client[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.repo.findOneBy({ id });
    if (!client) {
      throw new NotFoundException(`Cliente #${id} no encontrado`);
    }
    return client;
  }

  create(dto: CreateClientDto): Promise<Client> {
    this.logger.log(`Creando cliente: ${dto.name}`);
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    Object.assign(client, dto);
    this.logger.log(`Actualizando cliente #${id}`);
    return this.repo.save(client);
  }

  async remove(id: number): Promise<void> {
    const client = await this.findOne(id);
    await this.repo.remove(client);
    this.logger.log(`Cliente #${id} eliminado`);
  }
}
