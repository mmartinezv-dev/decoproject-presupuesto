import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string | undefined }) => value?.trim())
  name: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string | undefined }) => value?.trim())
  rut?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string | undefined }) => value?.trim())
  address?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string | undefined }) => value?.trim())
  phone?: string;
}
