import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @IsString()
  @MinLength(2)
  authorName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsString()
  @MinLength(10)
  comment: string;
}

export class UpdateReviewDto {
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
