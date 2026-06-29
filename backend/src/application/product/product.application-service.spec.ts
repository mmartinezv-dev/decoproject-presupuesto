/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, Logger } from '@nestjs/common';
import { ProductApplicationService } from './product.application-service';
import { PRODUCT_REPOSITORY } from '../../domain/product/repositories/product.repository.interface';
import type { IProductRepository } from '../../domain/product/repositories/product.repository.interface';
import type { ProductEntity } from '../../domain/product/entities/product.entity';

describe('ProductApplicationService', () => {
  let service: ProductApplicationService;
  let repository: jest.Mocked<IProductRepository>;
  let loggerSpy: jest.SpyInstance;

  const mockProductRepository = {
    findAll: jest.fn(),
    search: jest.fn(),
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
        ProductApplicationService,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductApplicationService>(ProductApplicationService);
    repository = module.get(PRODUCT_REPOSITORY);
    loggerSpy.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all products from the repository (Happy Path)', async () => {
      // Arrange
      const expectedProducts: ProductEntity[] = [
        {
          id: 1,
          name: 'Pintura Látex',
          description: 'Blanco 1 Galón',
          unit: 'gl',
          price: 25000,
          categoryId: 7,
        },
        {
          id: 2,
          name: 'Cemento Melón',
          description: 'Saco 25kg',
          unit: 'un',
          price: 6500,
          categoryId: 3,
        },
      ];
      repository.findAll.mockResolvedValueOnce(expectedProducts);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(expectedProducts);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('search', () => {
    it('should search products by query and return matches (Happy Path)', async () => {
      // Arrange
      const query = 'Pintura';
      const expectedProducts: ProductEntity[] = [
        {
          id: 1,
          name: 'Pintura Látex',
          description: 'Blanco 1 Galón',
          unit: 'gl',
          price: 25000,
          categoryId: 7,
        },
      ];
      repository.search.mockResolvedValueOnce(expectedProducts);

      // Act
      const result = await service.search(query);

      // Assert
      expect(result).toEqual(expectedProducts);
      expect(repository.search).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return the product if it exists (Happy Path)', async () => {
      // Arrange
      const productId = 1;
      const expectedProduct: ProductEntity = {
        id: productId,
        name: 'Pintura Látex',
        description: 'Blanco 1 Galón',
        unit: 'gl',
        price: 25000,
        categoryId: 7,
      };
      repository.findById.mockResolvedValueOnce(expectedProduct);

      // Act
      const result = await service.findOne(productId);

      // Assert
      expect(result).toEqual(expectedProduct);
      expect(repository.findById).toHaveBeenCalledWith(productId);
    });

    it('should throw a NotFoundException if product does not exist (Unhappy Path)', async () => {
      // Arrange
      const productId = 999;
      repository.findById.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.findOne(productId)).rejects.toThrow(
        new NotFoundException(`Producto #${productId} no encontrado`),
      );
      expect(repository.findById).toHaveBeenCalledWith(productId);
    });
  });

  describe('create', () => {
    it('should successfully create a new product and log the event (Happy Path)', async () => {
      // Arrange
      const newProductDto: Partial<ProductEntity> = {
        name: 'Yeso Cartón',
        description: 'Plancha 1.2x2.4',
        unit: 'un',
        price: 9000,
        categoryId: 4,
      };
      const createdProduct: ProductEntity = {
        id: 3,
        name: 'Yeso Cartón',
        description: 'Plancha 1.2x2.4',
        unit: 'un',
        price: 9000,
        categoryId: 4,
      };
      repository.create.mockResolvedValueOnce(createdProduct);

      // Act
      const result = await service.create(newProductDto);

      // Assert
      expect(result).toEqual(createdProduct);
      expect(repository.create).toHaveBeenCalledWith(newProductDto);
      expect(loggerSpy).toHaveBeenCalledWith(
        `Creando producto: ${newProductDto.name}`,
      );
    });
  });

  describe('update', () => {
    it('should update the product if it exists and log the event (Happy Path)', async () => {
      // Arrange
      const productId = 1;
      const existingProduct: ProductEntity = {
        id: productId,
        name: 'Pintura Látex',
        description: 'Blanco 1 Galón',
        unit: 'gl',
        price: 25000,
        categoryId: 7,
      };
      const updateDto: Partial<ProductEntity> = {
        price: 27000,
      };
      const updatedProduct: ProductEntity = {
        id: productId,
        name: 'Pintura Látex',
        description: 'Blanco 1 Galón',
        unit: 'gl',
        price: 27000,
        categoryId: 7,
      };

      repository.findById.mockResolvedValueOnce(existingProduct);
      repository.update.mockResolvedValueOnce(updatedProduct);

      // Act
      const result = await service.update(productId, updateDto);

      // Assert
      expect(result).toEqual(updatedProduct);
      expect(repository.findById).toHaveBeenCalledWith(productId);
      expect(repository.update).toHaveBeenCalledWith(productId, updateDto);
      expect(loggerSpy).toHaveBeenCalledWith(
        `Actualizando producto #${productId}`,
      );
    });

    it('should throw a NotFoundException and NOT update if product does not exist (Unhappy Path)', async () => {
      // Arrange
      const productId = 999;
      const updateDto: Partial<ProductEntity> = {
        name: 'Producto Inexistente',
      };
      repository.findById.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.update(productId, updateDto)).rejects.toThrow(
        new NotFoundException(`Producto #${productId} no encontrado`),
      );
      expect(repository.findById).toHaveBeenCalledWith(productId);
      expect(repository.update).not.toHaveBeenCalled();
      expect(loggerSpy).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete the product if it exists and log the event (Happy Path)', async () => {
      // Arrange
      const productId = 1;
      const existingProduct: ProductEntity = {
        id: productId,
        name: 'Pintura Látex',
        description: 'Blanco 1 Galón',
        unit: 'gl',
        price: 25000,
        categoryId: 7,
      };

      repository.findById.mockResolvedValueOnce(existingProduct);
      repository.remove.mockResolvedValueOnce(undefined);

      // Act
      await service.remove(productId);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith(productId);
      expect(repository.remove).toHaveBeenCalledWith(productId);
      expect(loggerSpy).toHaveBeenCalledWith(
        `Producto #${productId} eliminado`,
      );
    });

    it('should throw a NotFoundException and NOT delete if product does not exist (Unhappy Path)', async () => {
      // Arrange
      const productId = 999;
      repository.findById.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.remove(productId)).rejects.toThrow(
        new NotFoundException(`Producto #${productId} no encontrado`),
      );
      expect(repository.findById).toHaveBeenCalledWith(productId);
      expect(repository.remove).not.toHaveBeenCalled();
      expect(loggerSpy).not.toHaveBeenCalled();
    });
  });
});
