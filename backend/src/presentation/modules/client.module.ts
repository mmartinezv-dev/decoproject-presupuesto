import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientOrmEntity } from '../../infrastructure/database/typeorm/entities/client.orm-entity';
import { ClientTypeOrmRepository } from '../../infrastructure/database/typeorm/repositories/client.typeorm-repository';
import { CLIENT_REPOSITORY } from '../../domain/client/repositories/client.repository.interface';
import { ClientApplicationService } from '../../application/client/client.application-service';
import { ClientsController } from '../http/controllers/clients.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClientOrmEntity])],
  providers: [
    { provide: CLIENT_REPOSITORY, useClass: ClientTypeOrmRepository },
    ClientApplicationService,
  ],
  controllers: [ClientsController],
})
export class ClientModule {}
