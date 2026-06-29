import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  rut?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  address?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  phone?: string;
}
