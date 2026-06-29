/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, Logger } from '@nestjs/common';
import { BudgetApplicationService } from './budget.application-service';
import { BUDGET_REPOSITORY } from '../../domain/budget/repositories/budget.repository.interface';
import type {
  IBudgetRepository,
  BudgetSummary,
} from '../../domain/budget/repositories/budget.repository.interface';
import type { BudgetEntity } from '../../domain/budget/entities/budget.entity';

describe('BudgetApplicationService', () => {
  let service: BudgetApplicationService;
  let repository: jest.Mocked<IBudgetRepository>;
  let loggerSpy: jest.SpyInstance;

  const mockBudgetRepository = {
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
        BudgetApplicationService,
        {
          provide: BUDGET_REPOSITORY,
          useValue: mockBudgetRepository,
        },
      ],
    }).compile();

    service = module.get<BudgetApplicationService>(BudgetApplicationService);
    repository = module.get(BUDGET_REPOSITORY);
    loggerSpy.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all budget summaries from the repository (Happy Path)', async () => {
      // Arrange
      const expectedSummaries: BudgetSummary[] = [
        {
          id: 1,
          createdAt: new Date(),
          clientName: 'Juan Pérez',
          total: 119000,
        },
        {
          id: 2,
          createdAt: new Date(),
          clientName: 'María Gómez',
          total: 59500,
        },
      ];
      repository.findAll.mockResolvedValueOnce(expectedSummaries);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(expectedSummaries);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return the budget if it exists (Happy Path)', async () => {
      // Arrange
      const budgetId = 1;
      const expectedBudget: BudgetEntity = {
        id: budgetId,
        companyName: 'Constructora Alfa',
        companyRut: '76.123.456-7',
        companyAddress: 'Av. Las Condes 999',
        companyPhone: '+5622222222',
        clientName: 'Juan Pérez',
        clientRut: '12.345.678-9',
        clientAddress: 'Av. Siempre Viva 742',
        clientPhone: '+56912345678',
        notes: 'Presupuesto inicial para remodelación',
        visitFindings: [],
        visitSummary: '',
        preliminaryWorks: [],
        logo: '',
        images: [],
        neto: 100000,
        iva: 19000,
        total: 119000,
        items: [
          {
            productName: 'Insumo A',
            section: 'Materiales',
            unit: 'un',
            quantity: 2,
            price: 50000,
            subtotal: 100000,
          },
        ],
      };
      repository.findById.mockResolvedValueOnce(expectedBudget);

      // Act
      const result = await service.findOne(budgetId);

      // Assert
      expect(result).toEqual(expectedBudget);
      expect(repository.findById).toHaveBeenCalledWith(budgetId);
    });

    it('should throw a NotFoundException if budget does not exist (Unhappy Path)', async () => {
      // Arrange
      const budgetId = 999;
      repository.findById.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.findOne(budgetId)).rejects.toThrow(
        new NotFoundException(`Presupuesto #${budgetId} no encontrado`),
      );
      expect(repository.findById).toHaveBeenCalledWith(budgetId);
    });
  });

  describe('create', () => {
    it('should successfully create a new budget, calculate financial totals correctly and log the event (Happy Path)', async () => {
      // Arrange
      const newBudgetDto: Partial<BudgetEntity> = {
        clientName: 'Juan Pérez',
        neto: 100000,
        iva: 19000,
        total: 119000,
        items: [
          {
            productName: 'Insumo A',
            section: 'Materiales',
            unit: 'un',
            quantity: 2,
            price: 50000,
            subtotal: 100000,
          },
        ],
      };
      const createdBudget: BudgetEntity = {
        id: 3,
        companyName: 'Constructora Alfa',
        companyRut: '76.123.456-7',
        companyAddress: 'Av. Las Condes 999',
        companyPhone: '+5622222222',
        clientName: 'Juan Pérez',
        clientRut: '12.345.678-9',
        clientAddress: 'Av. Siempre Viva 742',
        clientPhone: '+56912345678',
        notes: '',
        visitFindings: [],
        visitSummary: '',
        preliminaryWorks: [],
        logo: '',
        images: [],
        neto: 100000,
        iva: 19000,
        total: 119000,
        items: [
          {
            id: 10,
            productName: 'Insumo A',
            section: 'Materiales',
            unit: 'un',
            quantity: 2,
            price: 50000,
            subtotal: 100000,
          },
        ],
      };
      repository.create.mockResolvedValueOnce(createdBudget);

      // Act
      const result = await service.create(newBudgetDto);

      // Assert
      expect(result).toEqual(createdBudget);
      expect(result.iva).toBe(result.neto * 0.19);
      expect(result.total).toBe(result.neto + result.iva);
      expect(repository.create).toHaveBeenCalledWith(newBudgetDto);
      expect(loggerSpy).toHaveBeenCalledWith(
        `Creando presupuesto para cliente: ${newBudgetDto.clientName}`,
      );
    });

    it('should log "Sin cliente" if clientName is empty or missing (Happy Path)', async () => {
      // Arrange
      const newBudgetDto: Partial<BudgetEntity> = {
        neto: 0,
        iva: 0,
        total: 0,
        items: [],
      };
      const createdBudget: BudgetEntity = {
        id: 4,
        companyName: '',
        companyRut: '',
        companyAddress: '',
        companyPhone: '',
        clientName: '',
        clientRut: '',
        clientAddress: '',
        clientPhone: '',
        notes: '',
        visitFindings: [],
        visitSummary: '',
        preliminaryWorks: [],
        logo: '',
        images: [],
        neto: 0,
        iva: 0,
        total: 0,
        items: [],
      };
      repository.create.mockResolvedValueOnce(createdBudget);

      // Act
      await service.create(newBudgetDto);

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        'Creando presupuesto para cliente: Sin cliente',
      );
    });
  });

  describe('update', () => {
    it('should update the budget if it exists and log the event (Happy Path)', async () => {
      // Arrange
      const budgetId = 1;
      const existingBudget: BudgetEntity = {
        id: budgetId,
        companyName: 'Constructora Alfa',
        companyRut: '76.123.456-7',
        companyAddress: 'Av. Las Condes 999',
        companyPhone: '+5622222222',
        clientName: 'Juan Pérez',
        clientRut: '12.345.678-9',
        clientAddress: 'Av. Siempre Viva 742',
        clientPhone: '+56912345678',
        notes: 'Original notes',
        visitFindings: [],
        visitSummary: '',
        preliminaryWorks: [],
        logo: '',
        images: [],
        neto: 100000,
        iva: 19000,
        total: 119000,
        items: [],
      };
      const updateDto: Partial<BudgetEntity> = {
        notes: 'Updated notes',
      };
      const updatedBudget: BudgetEntity = {
        id: budgetId,
        companyName: 'Constructora Alfa',
        companyRut: '76.123.456-7',
        companyAddress: 'Av. Las Condes 999',
        companyPhone: '+5622222222',
        clientName: 'Juan Pérez',
        clientRut: '12.345.678-9',
        clientAddress: 'Av. Siempre Viva 742',
        clientPhone: '+56912345678',
        notes: 'Updated notes',
        visitFindings: [],
        visitSummary: '',
        preliminaryWorks: [],
        logo: '',
        images: [],
        neto: 100000,
        iva: 19000,
        total: 119000,
        items: [],
      };

      repository.findById.mockResolvedValueOnce(existingBudget);
      repository.update.mockResolvedValueOnce(updatedBudget);

      // Act
      const result = await service.update(budgetId, updateDto);

      // Assert
      expect(result).toEqual(updatedBudget);
      expect(repository.findById).toHaveBeenCalledWith(budgetId);
      expect(repository.update).toHaveBeenCalledWith(budgetId, updateDto);
      expect(loggerSpy).toHaveBeenCalledWith(
        `Actualizando presupuesto #${budgetId}`,
      );
    });

    it('should throw a NotFoundException and NOT update if budget does not exist (Unhappy Path)', async () => {
      // Arrange
      const budgetId = 999;
      const updateDto: Partial<BudgetEntity> = {
        notes: 'Will fail',
      };
      repository.findById.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.update(budgetId, updateDto)).rejects.toThrow(
        new NotFoundException(`Presupuesto #${budgetId} no encontrado`),
      );
      expect(repository.findById).toHaveBeenCalledWith(budgetId);
      expect(repository.update).not.toHaveBeenCalled();
      expect(loggerSpy).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete the budget if it exists and log the event (Happy Path)', async () => {
      // Arrange
      const budgetId = 1;
      const existingBudget: BudgetEntity = {
        id: budgetId,
        companyName: 'Constructora Alfa',
        companyRut: '76.123.456-7',
        companyAddress: 'Av. Las Condes 999',
        companyPhone: '+5622222222',
        clientName: 'Juan Pérez',
        clientRut: '12.345.678-9',
        clientAddress: 'Av. Siempre Viva 742',
        clientPhone: '+56912345678',
        notes: 'Test budget',
        visitFindings: [],
        visitSummary: '',
        preliminaryWorks: [],
        logo: '',
        images: [],
        neto: 100000,
        iva: 19000,
        total: 119000,
        items: [],
      };

      repository.findById.mockResolvedValueOnce(existingBudget);
      repository.remove.mockResolvedValueOnce(undefined);

      // Act
      await service.remove(budgetId);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith(budgetId);
      expect(repository.remove).toHaveBeenCalledWith(budgetId);
      expect(loggerSpy).toHaveBeenCalledWith(
        `Presupuesto #${budgetId} eliminado`,
      );
    });

    it('should throw a NotFoundException and NOT delete if budget does not exist (Unhappy Path)', async () => {
      // Arrange
      const budgetId = 999;
      repository.findById.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.remove(budgetId)).rejects.toThrow(
        new NotFoundException(`Presupuesto #${budgetId} no encontrado`),
      );
      expect(repository.findById).toHaveBeenCalledWith(budgetId);
      expect(repository.remove).not.toHaveBeenCalled();
      expect(loggerSpy).not.toHaveBeenCalled();
    });
  });
});
