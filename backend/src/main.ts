import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(__dirname, '..', '.env') });
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './presentation/http/filters/all-exceptions.filter';
import { LoggingInterceptor } from './presentation/http/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api', { exclude: ['/'] });
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.enableShutdownHooks();

  await app.listen(3000);
  logger.log('Servidor corriendo en http://localhost:3000');
}
bootstrap();
