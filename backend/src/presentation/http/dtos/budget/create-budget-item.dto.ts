import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsInt,
  MaxLength,
} from 'class-validator';

export class CreateBudgetItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  productName: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  section?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  unit?: string;

  @IsNumber()
  @Min(0)
  @Max(9_999_999_999.99)
  quantity: number;

  @IsNumber()
  @Min(0)
  @Max(9_999_999_999.99)
  price: number;

  @IsNumber()
  @Min(0)
  @Max(99_999_999_999.99)
  subtotal: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  sectionIndex?: number | null;

  @IsNumber()
  @Min(0)
  @Max(99_999_999_999.99)
  @IsOptional()
  sectionManualTotal?: number | null;
}
