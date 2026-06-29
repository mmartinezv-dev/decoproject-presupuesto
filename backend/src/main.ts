import { config } from 'dotenv';
import { join } from 'path';
config({ path: join(__dirname, '..', '.env') });
import { mkdirSync } from 'fs';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './presentation/http/filters/all-exceptions.filter';
import { LoggingInterceptor } from './presentation/http/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');

  mkdirSync(join(process.cwd(), 'uploads'), { recursive: true });

  app.setGlobalPrefix('api', { exclude: ['/'] });
  app.use(cookieParser());
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });
  app.enableCors({ credentials: true, origin: true });

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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('DecoProject API')
    .setDescription('API de presupuestos para construcción y decoración')
    .setVersion('1.0')
    .addCookieAuth('refresh_token')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  logger.log('Servidor corriendo en http://localhost:3000');
}
void bootstrap();
