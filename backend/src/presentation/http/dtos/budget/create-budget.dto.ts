import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
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
  visitFindings?: {
    text: string;
    images: { src: string; caption: string }[];
  }[];

  @IsString()
  @IsOptional()
  visitSummary?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  preliminaryWorks?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  specialAnnotations?: string[];

  @IsString()
  @IsOptional()
  logo?: string;

  @IsArray()
  @IsOptional()
  images?: { src: string; caption: string }[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  neto?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  iva?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  total?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber()
  @Min(1)
  @Max(6)
  @IsOptional()
  currentStep?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBudgetItemDto)
  @IsOptional()
  items?: CreateBudgetItemDto[];
}
