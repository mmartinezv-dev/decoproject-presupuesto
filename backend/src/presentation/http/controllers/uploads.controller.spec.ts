import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Controller, Post, Body, ValidationPipe, Logger } from '@nestjs/common';
import { IsString, IsNotEmpty } from 'class-validator';
import request from 'supertest';
import { UploadsController } from './uploads.controller';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';
import * as fs from 'fs';
import * as path from 'path';

// DTO de prueba para validar ValidationPipe y el filtro de excepciones
class TestDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio para pruebas' })
  name: string;
}

@Controller('test-validation')
class TestValidationController {
  @Post()
  test(@Body() dto: TestDto) {
    return { success: true, received: dto.name };
  }
}

@Controller('test-error')
class TestErrorController {
  @Post()
  test() {
    throw new Error('Conexión perdida a base de datos');
  }
}

describe('Uploads & Exceptions Integration', () => {
  let app: INestApplication;
  const createdTestFiles: string[] = [];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UploadsController, TestValidationController, TestErrorController],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();
  });

  afterEach(async () => {
    await app.close();

    // Limpieza de archivos temporales creados en ./uploads durante los tests
    const uploadsDir = path.resolve('./uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        // Eliminar solo archivos que contengan el patrón de marca de tiempo único del test
        if (file.includes('-') && (file.endsWith('.png') || file.endsWith('.svg') || file.endsWith('.html'))) {
          try {
            fs.unlinkSync(path.join(uploadsDir, file));
          } catch {
            // Ignorar errores de archivos ya eliminados
          }
        }
      }
    }
  });

  describe('UploadsController - Security extension filter', () => {
    it('should allow uploading a valid image extension (Happy Path)', async () => {
      // Arrange
      const fileBuffer = Buffer.from('fake image content');

      // Act
      const response = await request(app.getHttpServer())
        .post('/uploads')
        .attach('files', fileBuffer, 'test_image.png');

      // Assert
      expect(response.status).toBe(201);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('url');
      expect(response.body[0].url).toContain('/uploads/');
      expect(response.body[0].url.endsWith('.png')).toBe(true);
    });

    it('should reject uploading a malicious SVG file with 400 Bad Request (Unhappy Path)', async () => {
      // Arrange
      const svgContent = '<svg><script>alert("XSS")</script></svg>';
      const fileBuffer = Buffer.from(svgContent);

      // Act
      const response = await request(app.getHttpServer())
        .post('/uploads')
        .attach('files', fileBuffer, 'malicious.svg');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body.message).toContain('Formato de imagen no permitido');
    });

    it('should reject uploading an HTML file with 400 Bad Request (Unhappy Path)', async () => {
      // Arrange
      const htmlContent = '<html><body><h1>Hack</h1></body></html>';
      const fileBuffer = Buffer.from(htmlContent);

      // Act
      const response = await request(app.getHttpServer())
        .post('/uploads')
        .attach('files', fileBuffer, 'exploit.html');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Formato de imagen no permitido');
    });
  });

  describe('AllExceptionsFilter - ValidationPipe error propagation', () => {
    it('should pass and return 201 when DTO is valid (Happy Path)', async () => {
      // Arrange
      const validPayload = { name: 'Construcción Local' };

      // Act
      const response = await request(app.getHttpServer())
        .post('/test-validation')
        .send(validPayload);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ success: true, received: 'Construcción Local' });
    });

    it('should capture validation errors and propagate details array (Unhappy Path)', async () => {
      // Arrange
      const invalidPayload = { name: '' }; // name vacío infringe @IsNotEmpty

      // Act
      const response = await request(app.getHttpServer())
        .post('/test-validation')
        .send(invalidPayload);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body).toHaveProperty('message');
      // Validar que se reciba el arreglo de mensajes de error de class-validator
      expect(Array.isArray(response.body.message)).toBe(true);
      expect(response.body.message[0]).toBe('El nombre es obligatorio para pruebas');
    });

    it('should default to 500 and log error stack when a generic Error is thrown (Unhappy Path)', async () => {
      // Arrange
      const errorLoggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

      // Act
      const response = await request(app.getHttpServer())
        .post('/test-error');

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('statusCode', 500);
      expect(response.body).toHaveProperty('message', 'Error interno del servidor');
      expect(errorLoggerSpy).toHaveBeenCalled();

      errorLoggerSpy.mockRestore();
    });
  });
});
