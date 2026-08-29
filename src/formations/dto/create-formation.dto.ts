import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class FormationFeatureDto {
  @IsOptional()
  @IsString()
  icon?: string;

  @IsString()
  @MinLength(1)
  text: string;
}

export class FormationPackageDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value == null ? 'yellow' : value))
  @IsIn(['yellow', 'blue', 'navy'])
  theme?: 'yellow' | 'blue' | 'navy';

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  minAgeLabel?: string;

  @IsOptional()
  @IsString()
  packageHeadline?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormationFeatureDto)
  features?: FormationFeatureDto[];

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  extraHourPrice?: number;

  @IsOptional()
  @IsString()
  extraHourLabel?: string;

  @IsOptional()
  @IsString()
  ctaLabel?: string;
}

export class CreateFormationDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  @MinLength(2)
  subtitle: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  startingPrice?: number;

  @IsOptional()
  @IsBoolean()
  isOnPromotion?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  oldPrice?: number;

  @IsOptional()
  @IsBoolean()
  isComingSoon?: boolean;

  @IsOptional()
  @IsIn(['formulas', 'packages', 'content'])
  detailLayout?: 'formulas' | 'packages' | 'content';

  @IsOptional()
  @IsString()
  detailSubtitle?: string;

  @IsOptional()
  @IsString()
  detailImageUrl?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormationFeatureDto)
  contentFeatures?: FormationFeatureDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormationPackageDto)
  packages?: FormationPackageDto[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;
}

export class UpdateFormationDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  subtitle?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  startingPrice?: number;

  @IsOptional()
  @IsBoolean()
  isOnPromotion?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  oldPrice?: number;

  @IsOptional()
  @IsBoolean()
  isComingSoon?: boolean;

  @IsOptional()
  @IsIn(['formulas', 'packages', 'content'])
  detailLayout?: 'formulas' | 'packages' | 'content';

  @IsOptional()
  @IsString()
  detailSubtitle?: string;

  @IsOptional()
  @IsString()
  detailImageUrl?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormationFeatureDto)
  contentFeatures?: FormationFeatureDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormationPackageDto)
  packages?: FormationPackageDto[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;
}
