import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ArrayMaxSize,
  ValidateNested,
  Min,
  Max,
  IsInt,
  IsIn,
  MaxLength,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CreateBudgetItemDto } from './create-budget-item.dto';

class BudgetImageDto {
  @IsString()
  @MaxLength(15_000_000)
  src: string;

  @IsString()
  @MaxLength(500)
  caption: string;
}

class VisitFindingDto {
  @IsString()
  @MaxLength(20_000)
  text: string;

  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => BudgetImageDto)
  images: BudgetImageDto[];
}

class SpecialAnnotationDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @MaxLength(20_000)
  text: string;
}

class BudgetSectionDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsNumber()
  @Min(0)
  @Max(99_999_999_999.99)
  @IsOptional()
  manualTotal?: number | null;
}

export class CreateBudgetDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string | undefined }) => value?.trim())
  @MaxLength(255)
  companyName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  companyRut?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  companyAddress?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  companyPhone?: string;

  @IsInt()
  @IsOptional()
  clientId?: number | null;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  clientName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  clientRut?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  clientAddress?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  clientPhone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20_000)
  notes?: string;

  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => VisitFindingDto)
  @IsOptional()
  visitFindings?: VisitFindingDto[];

  @IsString()
  @IsOptional()
  @MaxLength(20_000)
  visitSummary?: string;

  @IsArray()
  @ArrayMaxSize(100)
  @IsOptional()
  @IsString({ each: true })
  preliminaryWorks?: string[];

  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => SpecialAnnotationDto)
  @IsOptional()
  specialAnnotations?: SpecialAnnotationDto[];

  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => BudgetSectionDto)
  @IsOptional()
  sections?: BudgetSectionDto[];

  @IsString()
  @IsOptional()
  @MaxLength(15_000_000)
  logo?: string;

  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => BudgetImageDto)
  @IsOptional()
  images?: BudgetImageDto[];

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
  @IsIn(['borrador', 'final'])
  @IsOptional()
  status?: string;

  @IsInt()
  @Min(1)
  @Max(6)
  @IsOptional()
  currentStep?: number;

  @IsArray()
  @ArrayMaxSize(500)
  @ValidateNested({ each: true })
  @Type(() => CreateBudgetItemDto)
  @IsOptional()
  items?: CreateBudgetItemDto[];
}
