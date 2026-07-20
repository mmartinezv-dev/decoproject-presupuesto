import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';

const UPLOADS_DIR = join(process.cwd(), 'uploads');

@Controller('uploads')
export class UploadsController {
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: UPLOADS_DIR,
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase();
          cb(null, `${randomUUID()}${ext}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
        const allowedMimeTypes = [
          'image/png',
          'image/jpeg',
          'image/gif',
          'image/webp',
        ];
        if (
          !allowedExtensions.includes(ext) ||
          !allowedMimeTypes.includes(file.mimetype)
        ) {
          return cb(
            new BadRequestException(
              'Formato de imagen no permitido (solo png, jpg, jpeg, gif, webp)',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024,
        files: 20,
        fields: 0,
        parts: 20,
      },
    }),
  )
  upload(@UploadedFiles() files: Express.Multer.File[]) {
    return files.map((f) => ({ url: `/uploads/${f.filename}` }));
  }
}
