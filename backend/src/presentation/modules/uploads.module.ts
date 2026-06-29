import { Module } from '@nestjs/common';
import { UploadsController } from '../http/controllers/uploads.controller';

@Module({
  controllers: [UploadsController],
})
export class UploadsModule {}
