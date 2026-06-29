import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string | undefined }) => value?.trim())
  name: string;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}
