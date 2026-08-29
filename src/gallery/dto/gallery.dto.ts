import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GALLERY_SECTIONS } from '../schemas/gallery-item.schema';

export class CreateGalleryItemDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  alt?: string;

  @IsOptional()
  @IsIn([...GALLERY_SECTIONS])
  section?: (typeof GALLERY_SECTIONS)[number];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateGalleryItemDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  alt?: string;

  @IsOptional()
  @IsIn([...GALLERY_SECTIONS])
  section?: (typeof GALLERY_SECTIONS)[number];

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ReorderGalleryDto {
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}
