import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CreateBudgetItemDto } from './create-budget-item.dto';

export class CreateBudgetDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string | undefined }) => value?.trim())
  companyName?: string;

  @IsString()
  @IsOptional()
  companyRut?: string;

  @IsString()
  @IsOptional()
  companyAddress?: string;

  @IsString()
  @IsOptional()
  companyPhone?: string;

  @IsNumber()
  @IsOptional()
  clientId?: number | null;

  @IsString()
  @IsOptional()
  clientName?: string;

  @IsString()
  @IsOptional()
  clientRut?: string;

  @IsString()
  @IsOptional()
  clientAddress?: string;

  @IsString()
  @IsOptional()
  clientPhone?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsOptional()
  visitFindings?: { text: string; images: { src: string; caption: string }[] }[];

  @IsString()
  @IsOptional()
  visitSummary?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  preliminaryWorks?: string[];

  @IsString()
  @IsOptional()
  logo?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images?: string[];

  @IsNumber()
  @Min(0)
  neto: number;

  @IsNumber()
  @Min(0)
  iva: number;

  @IsNumber()
  @Min(0)
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBudgetItemDto)
  items: CreateBudgetItemDto[];
}
