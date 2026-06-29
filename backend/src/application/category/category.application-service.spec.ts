/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, Logger } from '@nestjs/common';
import { CategoryApplicationService } from './category.application-service';
import { CATEGORY_REPOSITORY } from '../../domain/category/repositories/category.repository.interface';
import type { ICategoryRepository } from '../../domain/category/repositories/category.repository.interface';
import type { CategoryEntity } from '../../domain/category/entities/category.entity';

describe('CategoryApplicationService', () => {
  let service: CategoryApplicationService;
  let repository: jest.Mocked<ICategoryRepository>;
  let loggerSpy: jest.SpyInstance;

  const mockCategoryRepository = {
    count: jest.fn(),
    saveMany: jest.fn(),
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
        CategoryApplicationService,
        {
          provide: CATEGORY_REPOSITORY,
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoryApplicationService>(
      CategoryApplicationService,
    );
    repository = module.get(CATEGORY_REPOSITORY);
    loggerSpy.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should create default categories when count is 0 (Happy Path)', async () => {
      // Arrange
      repository.count.mockResolvedValueOnce(0);
      repository.saveMany.mockResolvedValueOnce([]);

      // Act
      await service.onModuleInit();

      // Assert
      expect(repository.count).toHaveBeenCalledTimes(1);
      expect(repository.saveMany).toHaveBeenCalledWith([
        { name: 'Obras Preliminares', sortOrder: 1 },
        { name: 'Movimiento de Tierras', sortOrder: 2 },
        { name: 'Hormigón', sortOrder: 3 },
        { name: 'Albañilería y Tabiques', sortOrder: 4 },
        { name: 'Cubierta y Techumbre', sortOrder: 5 },
        { name: 'Instalaciones', sortOrder: 6 },
        { name: 'Terminaciones', sortOrder: 7 },
        { name: 'Carpintería', sortOrder: 8 },
        { name: 'Obras Exteriores', sortOrder: 9 },
      ]);
      expect(loggerSpy).toHaveBeenCalledWith('Categorías por defecto creadas');
    });

    it('should NOT create default categories when count is greater than 0 (Happy Path)', async () => {
      // Arrange
      repository.count.mockResolvedValueOnce(9);

      // Act
      await service.onModuleInit();

      // Assert
      expect(repository.count).toHaveBeenCalledTimes(1);
      expect(repository.saveMany).not.toHaveBeenCalled();
      expect(loggerSpy).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all categories from the repository (Happy Path)', async () => {
      // Arrange
      const expectedCategories: CategoryEntity[] = [
        { id: 1, name: 'Hormigón', sortOrder: 3 },
        { id: 2, name: 'Terminaciones', sortOrder: 7 },
      ];
      repository.findAll.mockResolvedValueOnce(expectedCategories);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(expectedCategories);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should successfully create a new category (Happy Path)', async () => {
      // Arrange
      const newCategoryDto: Partial<CategoryEntity> = {
        name: 'Electricidad',
        sortOrder: 10,
      };
      const createdCategory: CategoryEntity = {
        id: 3,
        name: 'Electricidad',
        sortOrder: 10,
      };
      repository.create.mockResolvedValueOnce(createdCategory);

      // Act
      const result = await service.create(newCategoryDto);

      // Assert
      expect(result).toEqual(createdCategory);
      expect(repository.create).toHaveBeenCalledWith(newCategoryDto);
    });
  });

  describe('findOne', () => {
    it('should return the category if it exists (Happy Path)', async () => {
      // Arrange
      const categoryId = 1;
      const expectedCategory: CategoryEntity = {
        id: categoryId,
        name: 'Hormigón',
        sortOrder: 3,
      };
      repository.findById.mockResolvedValueOnce(expectedCategory);

      // Act
      const result = await service.findOne(categoryId);

      // Assert
      expect(result).toEqual(expectedCategory);
      expect(repository.findById).toHaveBeenCalledWith(categoryId);
    });

    it('should throw a NotFoundException if category does not exist (Unhappy Path)', async () => {
      // Arrange
      const categoryId = 999;
      repository.findById.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.findOne(categoryId)).rejects.toThrow(
        new NotFoundException(`Categoría #${categoryId} no encontrada`),
      );
      expect(repository.findById).toHaveBeenCalledWith(categoryId);
    });
  });

  describe('update', () => {
    it('should update the category if it exists (Happy Path)', async () => {
      // Arrange
      const categoryId = 1;
      const existingCategory: CategoryEntity = {
        id: categoryId,
        name: 'Hormigón',
        sortOrder: 3,
      };
      const updateDto: Partial<CategoryEntity> = {
        name: 'Hormigón Armado',
      };
      const updatedCategory: CategoryEntity = {
        id: categoryId,
        name: 'Hormigón Armado',
        sortOrder: 3,
      };

      repository.findById.mockResolvedValueOnce(existingCategory);
      repository.update.mockResolvedValueOnce(updatedCategory);

      // Act
      const result = await service.update(categoryId, updateDto);

      // Assert
      expect(result).toEqual(updatedCategory);
      expect(repository.findById).toHaveBeenCalledWith(categoryId);
      expect(repository.update).toHaveBeenCalledWith(categoryId, updateDto);
    });

    it('should throw a NotFoundException and NOT update if category does not exist (Unhappy Path)', async () => {
      // Arrange
      const categoryId = 999;
      const updateDto: Partial<CategoryEntity> = {
        name: 'Nueva Categoría Inexistente',
      };
      repository.findById.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.update(categoryId, updateDto)).rejects.toThrow(
        new NotFoundException(`Categoría #${categoryId} no encontrada`),
      );
      expect(repository.findById).toHaveBeenCalledWith(categoryId);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete the category if it exists (Happy Path)', async () => {
      // Arrange
      const categoryId = 1;
      const existingCategory: CategoryEntity = {
        id: categoryId,
        name: 'Hormigón',
        sortOrder: 3,
      };

      repository.findById.mockResolvedValueOnce(existingCategory);
      repository.remove.mockResolvedValueOnce(undefined);

      // Act
      await service.remove(categoryId);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith(categoryId);
      expect(repository.remove).toHaveBeenCalledWith(categoryId);
    });

    it('should throw a NotFoundException and NOT delete if category does not exist (Unhappy Path)', async () => {
      // Arrange
      const categoryId = 999;
      repository.findById.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.remove(categoryId)).rejects.toThrow(
        new NotFoundException(`Categoría #${categoryId} no encontrada`),
      );
      expect(repository.findById).toHaveBeenCalledWith(categoryId);
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});
