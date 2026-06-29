/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, Logger } from '@nestjs/common';
import { ClientApplicationService } from './client.application-service';
import { CLIENT_REPOSITORY } from '../../domain/client/repositories/client.repository.interface';
import type { IClientRepository } from '../../domain/client/repositories/client.repository.interface';
import type { ClientEntity } from '../../domain/client/entities/client.entity';

describe('ClientApplicationService', () => {
  let service: ClientApplicationService;
  let repository: jest.Mocked<IClientRepository>;
  let loggerSpy: jest.SpyInstance;

  const mockClientRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    // Evitar que el logger ensucie la consola durante la ejecución de los tests
    loggerSpy = jest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation(() => {});

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientApplicationService,
        {
          provide: CLIENT_REPOSITORY,
          useValue: mockClientRepository,
        },
      ],
    }).compile();

    service = module.get<ClientApplicationService>(ClientApplicationService);
    repository = module.get(CLIENT_REPOSITORY);
    loggerSpy.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all clients from the repository (Happy Path)', async () => {
      // Arrange
      const expectedClients: ClientEntity[] = [
        {
          id: 1,
          name: 'Juan Pérez',
          rut: '12.345.678-9',
          address: 'Av. Siempre Viva 742',
          phone: '+56912345678',
        },
        {
          id: 2,
          name: 'María Gómez',
          rut: '98.765.432-1',
          address: 'Las Condes 1234',
          phone: '+56987654321',
        },
      ];
      repository.findAll.mockResolvedValueOnce(expectedClients);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(expectedClients);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return the client if it exists (Happy Path)', async () => {
      // Arrange
      const clientId = 1;
      const expectedClient: ClientEntity = {
        id: clientId,
        name: 'Juan Pérez',
        rut: '12.345.678-9',
        address: 'Av. Siempre Viva 742',
        phone: '+56912345678',
      };
      repository.findById.mockResolvedValueOnce(expectedClient);

      // Act
      const result = await service.findOne(clientId);

      // Assert
      expect(result).toEqual(expectedClient);
      expect(repository.findById).toHaveBeenCalledWith(clientId);
    });

    it('should throw a NotFoundException if client does not exist (Unhappy Path)', async () => {
      // Arrange
      const clientId = 999;
      repository.findById.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.findOne(clientId)).rejects.toThrow(
        new NotFoundException(`Cliente #${clientId} no encontrado`),
      );
      expect(repository.findById).toHaveBeenCalledWith(clientId);
    });
  });

  describe('create', () => {
    it('should successfully create a new client and log the event (Happy Path)', async () => {
      // Arrange
      const newClientDto: Partial<ClientEntity> = {
        name: 'Carlos Soto',
        rut: '15.678.901-2',
        address: 'Providencia 456',
        phone: '+56999988877',
      };
      const createdClient: ClientEntity = {
        id: 3,
        name: 'Carlos Soto',
        rut: '15.678.901-2',
        address: 'Providencia 456',
        phone: '+56999988877',
      };
      repository.create.mockResolvedValueOnce(createdClient);

      // Act
      const result = await service.create(newClientDto);

      // Assert
      expect(result).toEqual(createdClient);
      expect(repository.create).toHaveBeenCalledWith(newClientDto);
      expect(loggerSpy).toHaveBeenCalledWith(
        `Creando cliente: ${newClientDto.name}`,
      );
    });
  });

  describe('update', () => {
    it('should update the client if it exists and log the event (Happy Path)', async () => {
      // Arrange
      const clientId = 1;
      const existingClient: ClientEntity = {
        id: clientId,
        name: 'Juan Pérez',
        rut: '12.345.678-9',
        address: 'Av. Siempre Viva 742',
        phone: '+56912345678',
      };
      const updateDto: Partial<ClientEntity> = {
        name: 'Juan Pérez Ramos',
      };
      const updatedClient: ClientEntity = {
        id: clientId,
        name: 'Juan Pérez Ramos',
        rut: '12.345.678-9',
        address: 'Av. Siempre Viva 742',
        phone: '+56912345678',
      };

      repository.findById.mockResolvedValueOnce(existingClient);
      repository.update.mockResolvedValueOnce(updatedClient);

      // Act
      const result = await service.update(clientId, updateDto);

      // Assert
      expect(result).toEqual(updatedClient);
      expect(repository.findById).toHaveBeenCalledWith(clientId);
      expect(repository.update).toHaveBeenCalledWith(clientId, updateDto);
      expect(loggerSpy).toHaveBeenCalledWith(
        `Actualizando cliente #${clientId}`,
      );
    });

    it('should throw a NotFoundException and NOT update if client does not exist (Unhappy Path)', async () => {
      // Arrange
      const clientId = 999;
      const updateDto: Partial<ClientEntity> = {
        name: 'Cliente Inexistente',
      };
      repository.findById.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.update(clientId, updateDto)).rejects.toThrow(
        new NotFoundException(`Cliente #${clientId} no encontrado`),
      );
      expect(repository.findById).toHaveBeenCalledWith(clientId);
      expect(repository.update).not.toHaveBeenCalled();
      expect(loggerSpy).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete the client if it exists and log the event (Happy Path)', async () => {
      // Arrange
      const clientId = 1;
      const existingClient: ClientEntity = {
        id: clientId,
        name: 'Juan Pérez',
        rut: '12.345.678-9',
        address: 'Av. Siempre Viva 742',
        phone: '+56912345678',
      };

      repository.findById.mockResolvedValueOnce(existingClient);
      repository.remove.mockResolvedValueOnce(undefined);

      // Act
      await service.remove(clientId);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith(clientId);
      expect(repository.remove).toHaveBeenCalledWith(clientId);
      expect(loggerSpy).toHaveBeenCalledWith(`Cliente #${clientId} eliminado`);
    });

    it('should throw a NotFoundException and NOT delete if client does not exist (Unhappy Path)', async () => {
      // Arrange
      const clientId = 999;
      repository.findById.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.remove(clientId)).rejects.toThrow(
        new NotFoundException(`Cliente #${clientId} no encontrado`),
      );
      expect(repository.findById).toHaveBeenCalledWith(clientId);
      expect(repository.remove).not.toHaveBeenCalled();
      expect(loggerSpy).not.toHaveBeenCalled();
    });
  });
});
