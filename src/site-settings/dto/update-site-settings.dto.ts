import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OpeningHourDto {
  @IsString()
  @MinLength(2)
  day: string;

  @IsOptional()
  @IsString()
  openTime?: string;

  @IsOptional()
  @IsString()
  closeTime?: string;

  @IsOptional()
  @IsBoolean()
  isClosed?: boolean;
}

export class UpdateSiteSettingsDto {
  @IsOptional()
  @IsString()
  @MinLength(6)
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  address?: string;

  @IsOptional()
  @IsString()
  googleMapsUrl?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  tiktokUrl?: string;

  @IsOptional()
  @IsString()
  facebookUrl?: string;

  @IsOptional()
  @IsString()
  instagramUrl?: string;

  @IsOptional()
  @IsString()
  whatsappPhone?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpeningHourDto)
  hours?: OpeningHourDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpeningHourDto)
  lessonHours?: OpeningHourDto[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  statClients?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  statYears?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  statHours?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  statInstructors?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(200)
  marketYears?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(999)
  instructorCount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  successRate?: number;

  @IsOptional()
  @IsString()
  heroText?: string;

  @IsOptional()
  @IsString()
  aboutText1?: string;

  @IsOptional()
  @IsString()
  aboutText2?: string;

  @IsOptional()
  @IsString()
  vehicleModel?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  vehicleFeatures?: string[];

  @IsOptional()
  @IsString()
  questionText?: string;
}
